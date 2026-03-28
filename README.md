<img src=".github/eglador-logo.svg" alt="eglador-ui-react" width="200" />

# eglador-ui-react

A lightweight, reusable UI component library built with **Tailwind CSS v4** for React-based projects.

## Installation

```bash
npm install eglador-ui-react
```

**Peer dependencies:** `react >= 18` | `react-dom >= 18` | `tailwindcss ^4`

## Setup

Add the following to your global stylesheet (e.g. `app/globals.css`) so Tailwind can detect the component classes:

```css
@import "tailwindcss";
@source "../node_modules/eglador-ui-react/dist/**/*.{js,mjs}";
```

## Usage

```tsx
import { Button, ButtonGroup } from "eglador-ui-react";
```

## Components

| Component | Parameters |
|-----------|-----------|
| **Button** | `variant`, `color`, `size`, `shape`, `soft`, `icon`, `iconRight`, `loading`, `active`, `disabled`, `className` |
| **ButtonGroup** | `variant`, `className`, `children` |

## Development

```bash
npm install              # install dependencies
npm run storybook        # start storybook on http://localhost:6006
npm run build            # production build to dist/
npm run dev              # watch mode with live rebuild
npm run typecheck        # run typescript type checking
```

## Publishing

```bash
npm version patch        # bump version (e.g. 0.1.2 -> 0.1.3)
npm publish              # publish to npm (runs typecheck + build automatically)
```

## Compatibility

Works with any React-based framework: **Next.js**, **Remix**, **Vite + React**, **Gatsby**, and others.

## Author

**Kenan Gundogan** — [github.com/kenangundogan](https://github.com/kenangundogan)

## License

MIT
