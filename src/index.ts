import axios from 'axios'
import color from 'picocolors'
import { outro, intro, log, spinner } from '@clack/prompts'
import { join } from 'node:path'
import { Octokit } from '@octokit/rest'
import {
    writeFileSync,
    existsSync,
    mkdirSync
} from 'node:fs'

const isNextApp =
    existsSync('./src/app') ||
    existsSync('./app')

const isNextPages =
    existsSync('./src/pages') ||
    existsSync('./pages')

function resolveCssDir() {
    if (isNextApp) {
        return existsSync('./src/app')
            ? './src/app'
            : './app'
    }

    if (isNextPages) {
        return existsSync('./src/styles')
            ? './src/styles'
            : './styles'
    }

    return existsSync('./src')
        ? './src'
        : '.'
}

const cssDir = resolveCssDir()
const mediaDir = './public/assets/media'

function fileFormatName(fileName: string) {
    return fileName
        .replace('fa-', '')
        .replace(/-\d+(?=\.woff2$)/, '')
}

async function getText(url: string) {
    const { data } = await axios.get<string>(url, {
        headers: {
            referer: 'https://fontawesome.com/'
        }
    })

    return data
}

async function downloadFile(url: string) {
    const { data } = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: {
            referer: 'https://fontawesome.com/'
        }
    })

    mkdirSync(mediaDir, {
        recursive: true
    })

    const fileName = fileFormatName(
        url.split('/').at(-1) as string
    )

    const filePath = join(
        mediaDir,
        fileName
    )

    writeFileSync(
        filePath,
        Buffer.from(data)
    )

    log.step(
        `${color.green('Downloaded')} ${color.cyan(fileName)}`
    )
}

function saveCss(content: string) {
    mkdirSync(cssDir, {
        recursive: true
    })

    const cssPath = join(
        cssDir,
        'fontawesome.css'
    )

    writeFileSync(
        cssPath,
        content
    )

    log.success(
        `CSS saved to ${color.cyan(cssPath)}`
    )
}

async function main() {

    console.clear()
    console.log()

    intro(
        color.bgBlue(
            color.black(' Font Awesome Downloader ')
        )
    )

    const s = spinner()

    try {
        s.start('Fetching latest Font Awesome release')

        const octokit = new Octokit()

        const {
            data: { tag_name }
        } = await octokit.repos.getLatestRelease({
            owner: 'FortAwesome',
            repo: 'Font-Awesome'
        })

        s.stop(
            `Latest version ${color.green(tag_name)}`
        )

        const baseUrl =
            `https://site-assets.fontawesome.com/releases/v${tag_name}`

        s.start('Downloading CSS bundle')

        const raw = await getText(
            `${baseUrl}/css/all.css`
        )

        s.stop('CSS downloaded')

        const links = [
            ...new Set(
                [...raw.matchAll(
                    /url\(\s*['"]?([^'")]+)['"]?\s*\)/g
                )]
                    .map(v => v[1] as string)
                    .filter(v => v.endsWith('.woff2'))
            )
        ]

        log.info(
            `Found ${color.yellow(String(links.length))} font files`
        )

        let cssContent = raw

        for (const link of links) {
            const fileUrl =
                link.replace('..', baseUrl)

            const assetPath =
                '/assets/media/' +
                fileFormatName(
                    link.replace('../webfonts/', '')
                )

            cssContent =
                cssContent.replaceAll(
                    link,
                    assetPath
                )

            await downloadFile(fileUrl)
        }

        saveCss(cssContent)

        outro(
            [
                color.green('✓ Font Awesome installed'),
                '',
                `${color.gray('CSS')}   ${color.cyan(`${cssDir}/fontawesome.css`)}`,
                `${color.gray('Fonts')} ${color.cyan(mediaDir)}`
            ].join('\n')
        )
    } catch (error) {
        console.error(error)

        outro(
            color.red(
                'Failed to download Font Awesome'
            )
        )

        process.exit(1)
    }
}

main()
