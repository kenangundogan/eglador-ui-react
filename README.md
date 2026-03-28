<img src=".github/eglador-logo.svg" alt="eglador-ui-react" width="200" />

# eglador-ui-react

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
import { Button, ButtonGroup, Checkbox, CheckboxGroup, Input, InputGroup, Dropdown, Select, MultiSelect, Tabs, Accordion, Modal, MediaImage, MediaVideo, Tooltip, Breadcrumb, Typewriter, Carousel } from "eglador-ui-react";
```

## Components

| Component | Parameters |
|-----------|-----------|
| **Button** | `variant`, `color`, `size`, `shape`, `soft`, `icon`, `iconRight`, `loading`, `active`, `disabled`, `className` |
| **ButtonGroup** | `variant`, `className`, `children` |
| **Checkbox** | `variant`, `color`, `size`, `checked`, `onChange`, `indeterminate`, `label`, `description`, `disabled`, `name`, `value`, `className` |
| **CheckboxGroup** | `variant`, `className`, `children` |
| **Input** | `variant`, `color`, `size`, `shape`, `state`, `icon`, `iconRight`, `loading`, `label`, `errorMessage`, `successMessage`, `disabled`, `wrapperClassName`, `className` |
| **InputGroup** | `variant`, `className`, `children` |
| **Dropdown** | `side`, `align`, `width`, `maxHeight`, `scroll`, `autoFlip`, `open`, `onOpenChange`, `className` |
| **Dropdown.Trigger** | `asChild`, `className`, `children` |
| **Dropdown.Content** | `className`, `children` |
| **Select** | `value`, `onChange`, `options`, `placeholder`, `disabled`, `autoFlip`, `maxHeight`, `className` |
| **MultiSelect** | `value`, `onChange`, `options`, `placeholder`, `disabled`, `autoFlip`, `maxHeight`, `searchable`, `searchPlaceholder`, `maxSelected`, `maxVisibleChips`, `className` |
| **Tabs** | `value`, `defaultValue`, `onValueChange`, `variant`, `size`, `className` |
| **Tabs.List** | `className`, `children` |
| **Tabs.Trigger** | `value`, `icon`, `activeClassName`, `disabled`, `className` |
| **Tabs.Content** | `value`, `className`, `children` |
| **Accordion** | `title`, `icon`, `extra`, `defaultOpen`, `open`, `onOpenChange`, `variant`, `size`, `disabled`, `hideChevron`, `className` |
| **Modal** | `open`, `defaultOpen`, `onOpenChange`, `size`, `closeOnBackdrop`, `closeOnEscape` |
| **Modal.Trigger** | `asChild`, `className`, `children` |
| **Modal.Content** | `className`, `children` |
| **Modal.Header** | `icon`, `hideClose`, `className`, `children` |
| **Modal.Body** | `className`, `children` |
| **Modal.Footer** | `className`, `children` |
| **MediaImage** | `src`, `alt`, `caption`, `ratio`, `size`, `shape`, `objectFit`, `loading`, `hideCaption`, `onError`, `className` |
| **MediaVideo** | `src`, `caption`, `ratio`, `size`, `shape`, `controls`, `preload`, `autoPlay`, `muted`, `loop`, `poster`, `hideCaption`, `onError`, `className` |
| **Tooltip** | `content`, `position`, `delay`, `className`, `children` |
| **Breadcrumb** | `separator`, `className`, `children` |
| **Breadcrumb.Item** | `href`, `isActive`, `className`, `children` |
| **Typewriter** | `texts`, `typingSpeed`, `deletingSpeed`, `pauseDuration`, `deleteMode`, `loop`, `startDelay`, `cursor`, `cursorStyle`, `onComplete`, `className` |
| **Carousel** | `slides`, `slidesPerView`, `align`, `containScroll`, `dragFree`, `loop`, `axis`, `direction`, `plugins`, `showNavigation`, `showPagination`, `scrollToIndex`, `breakpoints`, `className` |

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
