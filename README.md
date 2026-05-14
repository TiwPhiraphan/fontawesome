# @tiwz/fontawesome

Download and self-host Font Awesome automatically for modern React frameworks.

Supports:

- Next.js App Router
- Next.js Pages Router
- Vite
- React

## Installation
### Free Version

```bash
npx @tiwz/fontawesome
```

or

```bash
bunx @tiwz/fontawesome
```

### Pro Version

```bash
npx @tiwz/fontawesome --pro
```

or

```bash
bunx @tiwz/fontawesome --pro
```

## Output

### Next.js App Router

```txt
public/assets/media/*
src/app/fontawesome.css
```

### Next.js Pages Router

```txt
public/assets/media/*
src/styles/fontawesome.css
```

### Vite / React

```txt
public/assets/media/*
src/fontawesome.css
```

Output path is detected automatically based on your project structure.

## Import CSS

### Next.js App Router

```ts
import './fontawesome.css'
```

### Next.js Pages Router

```ts
import '@/styles/fontawesome.css'
```

### Vite / React

```ts
import './fontawesome.css'
```

## Features

- Automatically downloads latest Font Awesome Free release
- Optimized CSS output
- Removes unused font formats
- Uses only `.woff2`
- Self-hosted assets
- Works with Next.js and Vite automatically
- No runtime dependency

## License

MIT