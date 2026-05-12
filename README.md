# @tiwz/fontawesome

Download and self-host Font Awesome automatically.

Supports:

- Next.js App Router
- Next.js Pages Router
- Vite
- React

## Usage

```bash
npx @tiwz/fontawesome
```

or

```bash
bunx @tiwz/fontawesome
```

## Output

```txt
public/assets/media/*
src/app/fontawesome.css
```

or

```txt
public/assets/media/*
src/styles/fontawesome.css
```

depending on your project structure.

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

## License

MIT