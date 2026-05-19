import { build, type Options } from 'tsup'

const options: Options = {
    format: 'esm',
    dts: true,
    clean: true,
    minify: true,
    bundle: false,
    splitting: true,
    external: ['react']
}

await build({ ...options, entry: ['src/*.ts'], outDir: 'dist', })
await build({ ...options, entry: ['src/bin/*.ts'], outDir: 'dist/bin', dts: false, bundle: true, banner: { js: '#!/usr/bin/env node' } })
