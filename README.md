<div align="center">

# `@tiwz/fontawesome`

<p>
  <a href="https://www.npmjs.com/package/@tiwz/fontawesome">
    <img src="https://img.shields.io/npm/v/@tiwz/fontawesome" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@tiwz/fontawesome">
    <img src="https://img.shields.io/npm/dt/@tiwz/fontawesome" alt="downloads" />
  </a>
  <a href="https://github.com/TiwPhiraphan/fontawesome/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@tiwz/fontawesome" alt="license" />
  </a>
</p>

Download and self-host Font Awesome automatically for **Next.js**, **Vite**, and **React** projects.

</div>

Download and self-host Font Awesome automatically for **Next.js**, **Vite**, and **React** projects.

Supports:

* Next.js App Router
* Next.js Pages Router
* Vite
* React
* Font Awesome Free
* Font Awesome Pro (`--pro`)

Optimized for:

* `woff2` only
* Local hosting
* Zero CDN dependency
* Fast production builds

---

# Features

* Automatically downloads the latest Font Awesome release
* Extracts and optimizes `all.css`
* Keeps only `woff2` fonts
* Removes unnecessary CSS comments
* Self-hosts fonts inside your project
* Auto-detects project structure
* Works with:

  * `src/app`
  * `app`
  * `src/pages`
  * `pages`
  * Vite React
  * Plain React

---

# Usage

## Font Awesome Free

```bash
npx @tiwz/fontawesome
```

or

```bash
bunx @tiwz/fontawesome
```

Browse icons:

* [https://fontawesome.com/search](https://fontawesome.com/search)

---

## Font Awesome Pro

```bash
npx @tiwz/fontawesome --pro
```

or

```bash
bunx @tiwz/fontawesome --pro
```

Browse icons:

* [https://fontawesome.com/v5/search](https://fontawesome.com/v5/search)

---

# Output Structure

## Next.js App Router

```txt
public/assets/media/*
src/app/fontawesome.css
```

or

```txt
public/assets/media/*
app/fontawesome.css
```

---

## Next.js Pages Router

```txt
public/assets/media/*
src/styles/fontawesome.css
```

or

```txt
public/assets/media/*
styles/fontawesome.css
```

---

## Vite / React

```txt
public/assets/media/*
src/fontawesome.css
```

---

# Import CSS

## Next.js App Router

```tsx
import './fontawesome.css'
```

---

## Next.js Pages Router

```tsx
import '@/styles/fontawesome.css'
```

---

## Vite / React

```tsx
import './fontawesome.css'
```

---

# Example

```tsx
export default function App() {
  return (
    <div>
      <i className="fa-solid fa-house"></i>
      <i className="fa-brands fa-github"></i>
    </div>
  )
}
```

---

# What Gets Optimized

The downloader automatically:

* Removes comments from CSS
* Keeps only `woff2`
* Removes unnecessary font formats
* Rewrites asset paths
* Downloads only required webfont files

This makes Font Awesome significantly smaller compared to the official CDN package.

---

# Why Self-Host?

Self-hosting gives you:

* Faster loading
* Better caching
* No third-party CDN dependency
* Better privacy
* Offline support
* More control over assets

---

# Project Detection

| Framework            | CSS Output               |
| -------------------- | ------------------------ |
| Next.js App Router   | `app/fontawesome.css`    |
| Next.js Pages Router | `styles/fontawesome.css` |
| Vite React           | `src/fontawesome.css`    |
| React                | `src/fontawesome.css`    |

---

# Requirements

* Node.js 18+
* Bun (optional)

---

# License

MIT

---

# Author

Created by Phiraphan Tanan

* GitHub: [https://github.com/TiwPhiraphan/fontawesome](https://github.com/TiwPhiraphan/fontawesome)
* npm: [https://www.npmjs.com/package/@tiwz/fontawesome](https://www.npmjs.com/package/@tiwz/fontawesome)
