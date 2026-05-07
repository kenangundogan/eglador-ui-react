# Tema & Özelleştirme

eglador-ui-react, **Tailwind CSS v4'ün `light-dark()` fonksiyonu** üzerine kurulu bir tema sistemi kullanır. Renk token'ları `@theme` bloğunda `light-dark(açıkDeğer, koyu Değer)` çiftleri olarak tanımlanır. `<html>` üzerindeki `data-theme` attribute hangi değerin aktif olduğunu belirler.

> **Önemli:** Bu sistem OKLCH CSS değişkeni tabanlı DEĞİLDİR. `--primary`, `--foreground` gibi semantik token'lar **yoktur**. Tailwind'in `bg-zinc-100`, `text-zinc-900` gibi standart utility sınıfları otomatik olarak aktif temaya göre çözümlenir — `dark:` prefix'i gerekmez.

---

## Kurulum (Zorunlu)

Global CSS dosyasına iki satır ekle:

```css
/* app/globals.css veya eşdeğer global CSS dosyası */
@import "tailwindcss";
@source "../node_modules/eglador-ui-react/dist/**/*.{js,mjs}";
```

`@source` satırı olmadan bileşen stilleri derlemeye dahil edilmez.

---

## Nasıl Çalışır

1. `themes.css` dosyası `@theme` bloğunda renk token'larını `light-dark()` çiftleri olarak tanımlar.
2. `<html data-theme="dark">` yazıldığında tarayıcı CSS `color-scheme: dark` geçişi yapar.
3. `light-dark()` fonksiyonu bu `color-scheme` değerine göre otomatik olarak doğru rengi seçer.
4. `dark:` prefix'li Tailwind sınıfına gerek yoktur — tüm renkler otomatik geçiş yapar.

```css
/* themes.css — kütüphanenin içinden */
@layer base {
  :root          { color-scheme: light; }
  [data-theme="dark"] { color-scheme: dark; }
}

@theme {
  --color-zinc-100: light-dark(#f4f4f5, #18181b);
  --color-zinc-900: light-dark(#18181b, #f4f4f5);
  /* ... diğer zinc tonları */
}
```

---

## Tema Değiştirme

Kütüphane iki utility fonksiyon export eder — React bileşeni yoktur:

```tsx
import { toggleTheme, setTheme } from "eglador-ui-react"

// dark ↔ light arası geçiş
toggleTheme()

// Belirli tema set et
setTheme("dark")
setTheme("light")

// İkinci parametre attribute adını özelleştirir (varsayılan: "data-theme")
setTheme("dark", "data-theme")
toggleTheme("data-theme")
```

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

`attribute="data-theme"` zorunludur — class tabanlı dark mode çalışmaz:

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

## Özel Renk Token'ı Ekleme (Tailwind v4)

Global CSS dosyasına `light-dark()` çiftini `@theme` bloğuyla ekle — yeni dosya oluşturma:

```css
/* globals.css */

/* Tailwind v4 ile kayıt et — light-dark() çifti olarak */
@theme inline {
  --color-brand:            light-dark(oklch(0.45 0.22 260), oklch(0.70 0.18 260));
  --color-brand-foreground: light-dark(oklch(0.98 0.01 260), oklch(0.15 0.02 260));
}
```

```tsx
/* Bileşenlerde kullan */
<div className="bg-brand text-brand-foreground">Marka rengi</div>
```

---

## Mevcut Renk Token'ları

Kütüphanenin `themes.css` dosyasında tanımlı token'lar:

| Token | Açıklama |
|-------|----------|
| `white` / `black` | Temaya göre tersine dönen beyaz/siyah |
| `zinc-50` → `zinc-950` | Tüm zinc tonları (11 adım) |

Bileşenler bu zinc paletini dahili olarak kullanır. Renk özelleştirme için kendi token'larını `@theme inline` ile ekleyebilirsin.

---

## Bileşen Özelleştirme

Tercih sırası:

### 1. Dahili variant ve color prop'ları — daima önce dene

```tsx
<Button variant="outline" size="sm" color="primary">Kaydet</Button>
<Badge variant="soft" color="warning" shape="pill">Beklemede</Badge>
<Alert variant="filled" color="danger" title="Hata" />
```

### 2. className ile layout

`className` yalnızca margin, padding, width, position için kullanılır. Renk override etmez.

```tsx
<Dialog.Content className="max-w-2xl">...</Dialog.Content>
<Table className="min-w-full">...</Table>
```

### 3. Özel token ile scoped override

```css
.my-branded-section {
  /* Bu scope içindeki bileşenler bu rengi kullanır */
  --color-zinc-900: light-dark(#1a1a2e, #e8e8f0);
}
```

### 4. Wrapper bileşen yaz

Projeye özgü yüksek seviyeli bileşenler için eglador bileşenlerini compose et:

```tsx
import { AlertDialog, Button, TrashIcon } from "eglador-ui-react"

export function DeleteConfirm({
  onConfirm,
  children,
}: {
  onConfirm: () => void
  children: React.ReactNode
}) {
  return (
    <AlertDialog color="danger">
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header icon={<TrashIcon />}>
          Silmek istediğine emin misin?
        </AlertDialog.Header>
        <AlertDialog.Description>
          Bu işlem geri alınamaz.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline">İptal</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button color="danger" onClick={onConfirm}>Sil</Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  )
}
```

---

## Dark Mode — Özel Bileşen Yazarken

Kütüphanenin tüm bileşenleri dark mode uyumludur. Kendi özel bileşenlerinde de `dark:` prefix'i **kullanma** — bunun yerine zinc token'larını doğrudan kullan:

```tsx
// ✅ Doğru — zinc token'ları temaya göre otomatik geçiş yapar
<div className="bg-zinc-50 text-zinc-900 border border-zinc-200">

// ❌ Yanlış — dark: prefix gereksiz ve eglador sistemiyle tutarsız
<div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
```
