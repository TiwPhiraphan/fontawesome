<div align="center">

# @tiwz/fontawesome

> Self-host Font Awesome in Next.js, Vite, and React — zero CDN, full SSR, typed icon autocomplete.

[![npm version](https://img.shields.io/npm/v/@tiwz/fontawesome?style=flat-square)](https://www.npmjs.com/package/@tiwz/fontawesome)
[![license](https://img.shields.io/npm/l/@tiwz/fontawesome?style=flat-square)](./LICENSE)
[![react peer](https://img.shields.io/npm/dependency-version/@tiwz/fontawesome/peer/react?style=flat-square)](https://www.npmjs.com/package/@tiwz/fontawesome)

</div>

---

## What's included

| | |
|---|---|
| **CLI** | Downloads Font Awesome CSS + webfonts from the official CDN into your project |
| **`<FontAwesomeIcon>`** | Typed React component — renders `<i>` with CSS classes, no SVG overhead |
| **`byPrefixAndName`** | Pre-built icon map with full TypeScript autocomplete for Free icons |

---

## Installation

```bash
npm install @tiwz/fontawesome
# or
bun add @tiwz/fontawesome
```

---

## Step 1 — Download assets with the CLI

### Free (auto-detects latest version)

```bash
npx @tiwz/fontawesome
```

### Pro (pinned to v5.15.4)

```bash
npx @tiwz/fontawesome --version-pro
```

The CLI will:

- Detect your project structure (Next.js App Router, Pages Router, Vite, or plain)
- Download the full Font Awesome CSS bundle and optimize it
- Save `.woff2` webfonts to `./public/assets/media/`
- Save `fontawesome.css` to the right directory for your setup

| Project type | CSS saved to |
|---|---|
| Next.js App Router `src/app/` | `src/app/fontawesome.css` |
| Next.js App Router `app/` | `app/fontawesome.css` |
| Next.js Pages Router `src/styles/` | `src/styles/fontawesome.css` |
| Next.js Pages Router `styles/` | `styles/fontawesome.css` |
| Vite / other with `src/` | `src/fontawesome.css` |
| Fallback | `./fontawesome.css` |

---

## Step 2 — Import the CSS globally

```ts
// Next.js App Router — src/app/layout.tsx or app/layout.tsx
import './fontawesome.css'

// Next.js Pages Router — src/pages/_app.tsx or pages/_app.tsx
import '../styles/fontawesome.css'

// Vite — src/main.tsx
import './fontawesome.css'
```

---

## Step 3 — Use the component

### Free icons

```tsx
import { FontAwesomeIcon, byPrefixAndName } from '@tiwz/fontawesome'

export default function App() {
  return (
    <>
      <FontAwesomeIcon icon={byPrefixAndName.fas['house']} />
      <FontAwesomeIcon icon={byPrefixAndName.far['star']} size="2x" />
      <FontAwesomeIcon icon={byPrefixAndName.fab['github']} animation="spin" />
    </>
  )
}
```

> Find free icons, [click here](https://fontawesome.com/search)

`byPrefixAndName.fas`, `.far`, and `.fab` are fully typed — your editor will autocomplete icon names as you type.

### Pro icons

Use Font Awesome icon names with prefix tuple format (aligned with official FA docs):

```tsx
import { FontAwesomeIcon } from '@tiwz/fontawesome/pro'

export default function App() {
  return (
    <>
      <FontAwesomeIcon icon={["fas", "house"]} />
      <FontAwesomeIcon icon={["far", "user"]} size="lg" fixedWidth />
      <FontAwesomeIcon icon={["fab", "github"]} animation="spin" />
    </>
  )
}
```

> Find pro icons, [click here](https://fontawesome.com/v5/search)

> `@tiwz/fontawesome/pro` uses a tuple format `["prefix", "icon-name"]` aligned with Font Awesome documentation for easy copy-paste. Available prefixes are `fas` (solid), `far` (regular), and `fab` (brands). Icons are provided as hardcoded metadata in the package.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `RawIcon \| [string, string]` | — | Icon object from `byPrefixAndName` (Free) or tuple `["prefix", "iconName"]` (Pro) **(required)** |
| `size` | `SizeOption` | — | `xs` `sm` `lg` `1x` `2x` … `10x` |
| `fixedWidth` | `boolean` | `false` | Fixed-width icon (`fa-fw`) |
| `animation` | `AnimationOption` | — | `spin` or `pulse` |
| `rotate` | `'90' \| '180' \| '270'` | — | Rotate the icon |
| `flip` | `FlipOption` | — | `horizontal` `vertical` `both` |
| `pull` | `'left' \| 'right'` | — | Float the icon left or right |
| `border` | `boolean` | `false` | Add a border (`fa-border`) |
| `inverse` | `boolean` | `false` | Invert the color (`fa-inverse`) |
| `stack` | `'1x' \| '2x'` | — | For use inside `fa-stack` wrappers |
| `className` | `string` | — | Extra CSS classes |
| `style` | `CSSProperties` | — | Inline styles |
| `title` | `string` | — | `title` attribute on `<i>` |
| `aria-hidden` | `boolean` | — | Hide from screen readers |
| `aria-label` | `string` | — | Accessible label |

### Size values

```
xs  sm  lg  1x  2x  3x  4x  5x  6x  7x  8x  9x  10x
```

### Animation values

```
spin   pulse
```

> Font Awesome v5 supports `spin` and `pulse` only. `beat`, `bounce`, `shake`, and `fade` are v6 features and are **not** available in this package.

---

## How it works

The component renders a plain `<i>` element — no SVG injection, no JS icon registry:

```html
<!-- Free: <FontAwesomeIcon icon={byPrefixAndName.fas['house']} size="lg" /> -->
<i class="fas fa-house fa-lg"></i>

<!-- Pro: <FontAwesomeIcon icon={["fab", "github"]} animation="spin" /> -->
<i class="fab fa-github fa-spin"></i>
```

All rendering is handled by the CSS and webfonts you downloaded in Step 1. This keeps your JavaScript bundle lean and SSR-safe with no hydration issues.

---

## Stacking icons

Use standard Font Awesome stacking via `className` and `stack`:

```tsx
// Free
<span className="fa-stack fa-lg">
  <FontAwesomeIcon icon={byPrefixAndName.fas['circle']} stack="2x" />
  <FontAwesomeIcon icon={byPrefixAndName.fas['flag']} stack="1x" inverse />
</span>

// Pro
<span className="fa-stack fa-lg">
  <FontAwesomeIcon icon={["fas", "circle"]} stack="2x" />
  <FontAwesomeIcon icon={["fas", "flag"]} stack="1x" inverse />
</span>
```

---

## Requirements

- **Node.js 18+** — for the CLI
- **React 18+** — for the component
- Font Awesome CSS must be loaded globally (via the CLI download)

---

## License

MIT © [Phiraphan Tanan](https://github.com/TiwPhiraphan)
