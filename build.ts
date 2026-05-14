
await Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'esm',
    target: 'node',
    sourcemap: 'none',
    minify: true,
    splitting: false,
    banner: '#!/usr/bin/env node'
})
