import axios from 'axios'
import color from 'picocolors'
import { join } from 'node:path'
import { Octokit } from '@octokit/rest'
import { outro, intro, log, spinner } from '@clack/prompts'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'

const proVersion = '5.15.4'
const cssDir = resolveCssDir()
const mediaDir = './public/assets/media'
const isPro = process.argv.includes('--pro')
const isNextApp = existsSync('./src/app') || existsSync('./app')
const isNextPages = existsSync('./src/pages') || existsSync('./pages')

function resolveCssDir() {
    if (isNextApp) return existsSync('./src/app') ? './src/app' : './app'
    if (isNextPages) return existsSync('./src/styles') ? './src/styles' : './styles'
    return existsSync('./src') ? './src' : '.'
}

function fileFormatName(fileName: string) {
    return fileName.replace('fa-', '').replace(/-\d+(?=\.woff2$)/, '')
}

async function getText(url: string) {
    const { data } = await axios.get<string>(url, {
        headers: { referer: 'https://fontawesome.com/' }
    })
    return data
}

async function downloadFile(url: string) {
    const { data } = await axios.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: { referer: 'https://fontawesome.com/' }
    })
    mkdirSync(mediaDir, { recursive: true })
    const fileName = fileFormatName(url.split('/').at(-1) as string)
    const filePath = join(mediaDir, fileName)
    writeFileSync(filePath, Buffer.from(data))
    log.step(`${color.green('Downloaded')} ${color.cyan(fileName)}`)
}

function saveCss(content: string) {
    mkdirSync(cssDir, { recursive: true })
    const cssPath = join(cssDir, 'fontawesome.css')
    writeFileSync(cssPath, content)
    log.success(`CSS saved to ${color.cyan(cssPath)}`)
}

async function getVersion() {
    if (isPro) return proVersion
    const octokit = new Octokit()
    const { data: { tag_name } } = await octokit.repos.getLatestRelease({
        owner: 'FortAwesome',
        repo: 'Font-Awesome'
    })
    return tag_name
}

async function main() {
    console.clear()
    console.log()
    intro(color.bgBlue(color.black(` Font Awesome ${isPro ? 'Pro' : 'Free'} Downloader `)))
    const s = spinner()
    try {
        s.start('Fetching Font Awesome release')
        const version = await getVersion()
        s.stop(`${isPro ? 'Pro' : 'Free'} version ${color.green(version)}`)
        const baseUrl = isPro
            ? `https://pro.fontawesome.com/releases/v${version}`
            : `https://site-assets.fontawesome.com/releases/v${version}`
        s.start('Downloading CSS bundle')
        const raw = await getText(`${baseUrl}/css/all.css`)
        const optimized = raw
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/src:[^}]*?url\(([^)]+\.woff2[^)]*)\)\s*format\(["']woff2["']\)[^}]*?(?=})/gs, 'src:url($1) format("woff2")')
            .trim()
        s.stop('CSS downloaded')
        const links = [...new Set([...optimized.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map(v => v[1] as string))]
        log.info(`Found ${color.yellow(String(links.length))} font files`)
        let cssContent = optimized
        for (const link of links) {
            const fileUrl = link.replace('..', baseUrl)
            const assetPath = '/assets/media/' + fileFormatName(link.replace('../webfonts/', ''))
            cssContent = cssContent.replaceAll(link, assetPath)
            await downloadFile(fileUrl)
        }
        saveCss(cssContent)
        outro([
            color.green(`✓ Font Awesome ${isPro ? 'Pro' : 'Free'} installed`),
            '',
            `${color.gray('CSS')}   ${color.cyan(`${cssDir}/fontawesome.css`)}`,
            `${color.gray('Fonts')} ${color.cyan(mediaDir)}`
        ].join('\n'))
    } catch (error) {
        console.error(error)
        outro(color.red(`Failed to download Font Awesome ${isPro ? 'Pro' : 'Free'}`))
        process.exit(1)
    }
}

main()
