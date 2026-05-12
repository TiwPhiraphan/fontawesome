
await Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'cjs',
    target: 'node',
    sourcemap: 'none',
    minify: true,
    splitting: false,
    banner: '#!/usr/bin/env node'
})
