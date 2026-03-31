<img src=".github/eglador-logo.svg" alt="eglador-ui-react" width="200" />

# eglador-ui-react

[![npm version](https://img.shields.io/npm/v/eglador-ui-react?style=flat-square&color=blue)](https://www.npmjs.com/package/eglador-ui-react)
[![npm downloads](https://img.shields.io/npm/dm/eglador-ui-react?style=flat-square&color=green)](https://www.npmjs.com/package/eglador-ui-react)
[![license](https://img.shields.io/npm/l/eglador-ui-react?style=flat-square)](https://github.com/kenangundogan/eglador-ui-react/blob/main/LICENSE)
![tailwind v4](https://img.shields.io/badge/tailwindcss-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![react >= 18](https://img.shields.io/badge/react-%3E%3D18-61DAFB?style=flat-square&logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-ready-3178C6?style=flat-square&logo=typescript&logoColor=white)

A lightweight, reusable UI component library built with **Tailwind CSS v4** for React-based projects.

## Installation

```bash
npm install eglador-ui-react
```

**Peer dependencies:** `react >= 18` | `react-dom >= 18` | `tailwindcss ^4`

**Optional (for Carousel):** `embla-carousel ^8` | `embla-carousel-react ^8` | plugin packages as needed (`embla-carousel-autoplay`, `embla-carousel-fade`, etc.)

## Setup

Add the following to your global stylesheet (e.g. `app/globals.css`) so Tailwind can detect the component classes:

```css
@import "tailwindcss";
@source "../node_modules/eglador-ui-react/dist/**/*.{js,mjs}";
```

## Usage

```tsx
import { Button, Input, Modal } from "eglador-ui-react";
```

## Components

| Category | Components |
|----------|-----------|
| **Actions** | Button, ButtonGroup, Link |
| **Forms** | Input, InputGroup, Textarea, Select, MultiSelect, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Label |
| **Feedback** | Alert, Notification, Progress, Spinner, Skeleton |
| **Navigation** | Stepper, Breadcrumb |
| **Data Display** | Table, Accordion, Tabs, Badge, Avatar, Empty, Kbd, Tooltip, Typography, Typewriter |
| **Overlays** | Modal, Drawer, Dropdown, Popover, AlertDialog |
| **Layout** | Separator, Collapsible, AspectRatio, ScrollArea, Resizable |
| **Media** | MediaImage, MediaVideo, Carousel |

## Development

```bash
npm install              # install dependencies
npm run storybook        # start storybook on http://localhost:6006
npm run build            # production build to dist/
npm run dev              # watch mode with live rebuild
npm run typecheck        # run typescript type checking
```

## Publishing

Publishing is automated via GitHub Actions. When a GitHub Release is created, the package is automatically published to npm.

1. Update `version` in `package.json`
2. Commit and push
3. Create a GitHub Release with a matching tag (e.g. `v0.1.0-alpha.12`)

## Compatibility

Works with any React-based framework: **Next.js**, **Remix**, **Vite + React**, **Gatsby**, and others.

## Author

**Kenan Gundogan** — [github.com/kenangundogan](https://github.com/kenangundogan)

## License

MIT
