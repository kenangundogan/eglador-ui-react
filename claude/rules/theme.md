# Tema Sistemi

eglador-ui-react tema sistemi **`data-theme` attribute** tabanlıdır. `<html>` elementine `data-theme="dark"` veya `data-theme="light"` yazarak aktif tema değişir.

`Theme` adında bir wrapper React bileşeni **yoktur**. Kütüphane yalnızca iki utility fonksiyon export eder.

---

## Utility Fonksiyonlar

```tsx
import { toggleTheme, setTheme } from "eglador-ui-react"

// Tema toggle — dark ↔ light arası geçiş
toggleTheme()
// document.documentElement üzerinde data-theme="dark" ↔ data-theme="light"

// Tema sabit set et
setTheme("dark")
setTheme("light")

// İkinci parametre attribute adını özelleştirir (varsayılan: "data-theme")
setTheme("dark", "data-theme")
toggleTheme("data-theme")
```

---

## Tema Sistemi Nasıl Çalışır

Bu kütüphane `--primary`, `--background`, `--foreground` gibi semantik CSS değişkenleri **kullanmaz**. Bunun yerine Tailwind v4'ün `light-dark()` fonksiyonu ile zinc renk token'ları tanımlanmıştır:

```css
/* globals.css — zorunlu iki satır */
@import "tailwindcss";
@source "../node_modules/eglador-ui-react/dist/**/*.{js,mjs}";

/* kütüphanenin themes.css'i içinden — data-theme ile color-scheme değişir */
/* :root { color-scheme: light; }                     */
/* [data-theme="dark"] { color-scheme: dark; }        */
/* @theme { --color-zinc-100: light-dark(#f4f4f5, #18181b); ... } */
```

`color-scheme` değişince `light-dark(açık, koyu)` çiftleri otomatik olarak doğru değeri seçer.
`dark:` prefix'li Tailwind sınıfı kullanmana gerek yoktur.

---

## HTML Başlangıç Kurulumu

```html
<!-- index.html veya _document.tsx -->
<html data-theme="light">
```

```tsx
// Kullanıcı tercihini localStorage'dan yükle
import { setTheme } from "eglador-ui-react"

function initTheme() {
  const saved = localStorage.getItem("theme") as "dark" | "light" | null
  if (saved) {
    setTheme(saved)
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark")
  }
}
```

---

## Tema Toggle Butonu

```tsx
import { Button, toggleTheme } from "eglador-ui-react"

function ThemeToggle() {
  const handleToggle = () => {
    toggleTheme()
    const current = document.documentElement.getAttribute("data-theme")
    localStorage.setItem("theme", current ?? "light")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle}>
      Tema Değiştir
    </Button>
  )
}
```

---

## next-themes ile Kullanım

next-themes kullanıyorsan `attribute="data-theme"` zorunludur — class tabanlı dark mode **çalışmaz**.

```tsx
// ✅ Doğru
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>

// ❌ Yanlış — class tabanlı eglador bileşenleriyle uyumsuz
<ThemeProvider attribute="class">
```

---

## Özel Renk Ekleme

Global CSS dosyasına `light-dark()` çifti olarak ekle — yeni dosya oluşturma:

```css
/* globals.css — @theme inline ile kayıt et */
@theme inline {
  --color-brand:            light-dark(oklch(0.45 0.22 260), oklch(0.70 0.18 260));
  --color-brand-foreground: light-dark(oklch(0.98 0.01 260), oklch(0.15 0.02 260));
}
```

```tsx
/* Bileşenlerde kullan */
<div className="bg-brand text-brand-foreground">Marka rengi</div>
```
