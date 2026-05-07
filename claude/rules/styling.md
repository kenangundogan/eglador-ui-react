# Stil & Tailwind

Tema ayarları için: [customization.md](../customization.md)

## İçindekiler

- className sadece layout için
- Variant + color prop'larını kullan
- space-x-* / space-y-* kullanma
- Eşit boyut için size-* kullan
- truncate kısayolu
- Manuel dark: renk override'ı yazma
- cn() ile koşullu sınıflar
- Overlay bileşenlere manuel z-index ekleme

---

## className Sadece Layout İçin

`className` prop'u yalnızca layout ve konumlandırma içindir (max-w, mx-auto, mt-4 gibi). Bileşenin rengini veya tipografisini override etme — bunun için `variant`, `color` prop'larını kullan.

**Yanlış:**

```tsx
<Button className="bg-blue-500 text-white hover:bg-blue-600">
  Kaydet
</Button>
```

**Doğru:**

```tsx
<Button variant="solid" color="primary">
  Kaydet
</Button>
```

Renk özelleştirme öncelik sırası:
1. `variant` + `color` prop'ları — `variant="outline" color="danger"`
2. CSS değişkenleri — global CSS'de tanımla (bkz. [customization.md](../customization.md))
3. `className` — yalnızca margin, padding, width, position için

---

## Variant + Color Prop'larını Kullan

**Yanlış:**

```tsx
<Badge className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
  Aktif
</Badge>

<Alert className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
  Dikkat!
</Alert>
```

**Doğru:**

```tsx
<Badge variant="soft" color="success" shape="pill">
  Aktif
</Badge>

<Alert color="warning" title="Dikkat!">
  ...
</Alert>
```

Durum renkleri için her zaman `color` prop'unu kullan:

```tsx
<Badge color="success">Aktif</Badge>
<Badge color="danger">Hata</Badge>
<Badge color="warning">Beklemede</Badge>
<Badge color="info">Bilgi</Badge>
<Badge color="primary">Yeni</Badge>
```

---

## space-x-* / space-y-* Kullanma

`gap-*` kullan. `space-y-4` → `flex flex-col gap-4`, `space-x-2` → `flex gap-2`.

```tsx
// ✅
<div className="flex flex-col gap-4">
  <Input placeholder="Ad" />
  <Input placeholder="Soyad" />
  <Button>Gönder</Button>
</div>

// ❌
<div className="space-y-4">
  <Input placeholder="Ad" />
</div>
```

---

## Eşit Boyut İçin size-* Kullan

`size-10` doğru, `w-10 h-10` yanlış. İkon, avatar, skeleton gibi eşit kenarlı elemanlar için.

```tsx
// ✅
<Avatar className="size-10" />
<Skeleton className="size-12 rounded-full" />
<div className="size-4">...</div>

// ❌
<Avatar className="w-10 h-10" />
```

---

## truncate Kısayolu

```tsx
// ✅
<span className="truncate max-w-xs">Çok uzun bir metin içeriği...</span>

// ❌
<span className="overflow-hidden text-ellipsis whitespace-nowrap">...</span>
```

---

## Manuel dark: Renk Override'ı Yazma

Bileşenler zaten dark mode uyumludur. Renk token'ları `light-dark()` CSS fonksiyonu ile tanımlandığından `dark:` prefix'ine gerek yoktur.

```tsx
// ✅ — zinc token'ları data-theme'e göre otomatik geçiş yapar
<Button variant="outline">Ayarlar</Button>
<div className="bg-zinc-50 text-zinc-900">İçerik</div>

// ❌ — dark: prefix gereksiz ve eglador sistemiyle tutarsız
<div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
```

Dark mode kurulumu için: [customization.md](../customization.md)

---

## cn() ile Koşullu Sınıflar

```tsx
import { cn } from "eglador-ui-react"

// ✅
<div className={cn(
  "flex items-center px-3 py-2 rounded-lg",
  isActive && "bg-zinc-100",
  isDisabled && "opacity-50 cursor-not-allowed",
  variant === "bordered" && "border border-zinc-200"
)}>

// ❌ — template literal ternary
<div className={`flex items-center px-3 py-2 ${isActive ? "bg-zinc-100" : ""}`}>
```

---

## Overlay Bileşenlere Manuel z-index Ekleme

`Dialog`, `Drawer`, `AlertDialog`, `Dropdown`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `Command` kendi z-index'lerini yönetir.

```tsx
// ❌ Gereksiz z-index
<Dialog.Content className="z-50">...</Dialog.Content>
<Dropdown.Content className="z-999">...</Dropdown.Content>

// ✅ z-index ekleme
<Dialog.Content>...</Dialog.Content>
<Dropdown.Content>...</Dropdown.Content>
```
