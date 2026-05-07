---
name: eglador
description: eglador-ui-react bileşen kütüphanesini yönetir — bileşen kullanımı, composition API, stil, form yapısı, tema, ikon sistemi ve hata ayıklama. eglador-ui-react import'u olan veya "eglador" bileşeni oluşturma/düzeltme/stilize etme isteği olan projelerde devreye girer.
user-invocable: false
---

# eglador-ui-react

React + Tailwind CSS v4 tabanlı bir UI bileşen kütüphanesi. Tüm bileşenler doğrudan `eglador-ui-react` paketinden import edilir.

## Kurulum

```bash
npm install eglador-ui-react
```

**Global CSS (zorunlu)** — Tailwind'in bileşen sınıflarını taraması için:

```css
/* app/globals.css veya eşdeğeri */
@import "tailwindcss";
@source "../node_modules/eglador-ui-react/dist/**/*.{js,mjs}";
```

**Import:**

```tsx
import { Button, Input, Table, Dialog, LineChart } from "eglador-ui-react"
import { cn, SearchIcon, ChevronDownIcon } from "eglador-ui-react"
```

---

## Prensipler

1. **Önce mevcut bileşeni kullan.** Özel markup yazmadan önce kütüphanede karşılığı var mı kontrol et.
2. **Composition API'yi tam doğru kullan.** `<Table.Head>` doğrudur — bunun için ayrıca `TableHead` import edilmez.
3. **Hangi bileşenin composition hangisinin tekil olduğunu bil.** Örn. `Select`, `Alert`, `Empty`, `Accordion` tekil bileşenlerdir; alt bileşen API'leri yoktur.
4. **Built-in prop'ları tercih et.** `variant`, `color`, `size`, `shape` prop'ları yeterlidir — className ile override etme.
5. **İkon için dış kütüphane import etme.** Kütüphanenin dahili ikon sistemi 40+ ikon içerir; hepsi `eglador-ui-react`'tan gelir ve `Icon` sufixiyle biter.

---

## Kritik Kurallar

### Stil & Tailwind → [styling.md](./rules/styling.md)

- **`className` sadece layout için.** Bileşen renklerini override etme.
- **`space-x-*` / `space-y-*` kullanma.** `flex` + `gap-*` kullan.
- **Eşit boyutlarda `size-*` kullan.** `size-10` doğru, `w-10 h-10` yanlış.
- **`truncate` kısayolunu kullan.**
- **Koşullu sınıflar için `cn()` kullan.**

### Form & Input'lar → [forms.md](./rules/forms.md)

- **`Input` içinde `icon` / `iconRight` / `state` prop'larını kullan.** Wrapper div + absolute positioning yapma.
- **`InputGroup` içine raw bileşen koy, `InputGroup.Text` ve `InputGroup.Addon` kullan.**
- **`Select` tekil bileşendir.** `options` prop'u ile çalışır; `.Trigger`, `.Item` gibi alt bileşenleri yoktur.
- **Çoklu seçim → `MultiSelect`.** Manuel checkbox döngüsü yazma.

### Bileşen Yapısı → [composition.md](./rules/composition.md)

- **Hangi bileşenler composition API kullanır bilmek zorundasın.**
- **`Button` zaten `loading` prop'una sahiptir.** `loading={true}` verince dahili spinner gösterir.
- **Overlay bileşenler kendi z-index'ini yönetir.** Manuel `z-50` ekleme.

### İkonlar → [icons.md](./rules/icons.md)

- **İkon isimleri `Icon` sufixiyle biter:** `SearchIcon`, `ChevronDownIcon`, `XIcon`.
- **`eglador-ui-react`'tan import et.** Dış kütüphane (lucide-react, tabler) import etme.
- **Bileşen içinde ikon boyutu verme.** Bileşen halleder.

### Grafik → [charts.md](./rules/charts.md)

- **`Chart` diye tek bir bileşen yoktur.** `LineChart`, `BarChart`, `AreaChart`, `PieChart`, `DonutChart`, `RadarChart`, `RadialChart` ayrı ayrı export'tur.
- **Recharts doğrudan import etme.**

---

## Bileşen API Konvansiyonları

Tutarlı prop isimleri:

| Prop | Örnek değerler |
|------|----------------|
| `variant` | `"solid"` `"outline"` `"ghost"` (Button) / `"soft"` `"outline"` `"filled"` (Alert) |
| `color` | `"default"` `"black"` `"primary"` `"danger"` `"success"` `"warning"` `"info"` |
| `size` | `"xs"` `"sm"` `"md"` (bazılarında `"lg"`) |
| `shape` | `"square"` `"rounded"` `"circle"` (Button) / `"pill"` (Badge) |
| `icon` | `React.ReactNode` — sol ikon |
| `iconRight` | `React.ReactNode` — sağ ikon |
| `disabled` | `boolean` |
| `className` | `string` — ek Tailwind sınıfları |

**Button'a özgü:** `soft?: boolean` (soft renk tonu için ayrı boolean — `variant="soft"` yoktur)  
**Button'a özgü:** `loading?: boolean` — dahili spinner gösterir, butonu devre dışı bırakır

---

## Composition API Haritası

Yalnızca aşağıdaki bileşenler sub-component API'sine sahiptir:

| Bileşen | Sub-component'ler |
|---------|-------------------|
| `Table` | `.Head` `.Body` `.Row` `.Header` `.Cell` |
| `Command` | `.Input` `.List` `.Group` `.Item` `.Separator` `.Empty` |
| `Tabs` | `.Root` `.List` `.Trigger` `.Content` |
| `Dialog` | `.Trigger` `.Content` `.Header` `.Title` `.Description` `.Close` `.Footer` `.Body` |
| `Drawer` | `.Trigger` `.Content` `.Header` `.Body` `.Footer` |
| `AlertDialog` | `.Trigger` `.Content` `.Header` `.Description` `.Footer` `.Cancel` `.Action` |
| `Dropdown` | `.Trigger` `.Content` |
| `Popover` | `.Trigger` `.Content` |
| `HoverCard` | `.Trigger` `.Content` |
| `ContextMenu` | `.Trigger` `.Content` `.Item` `.Group` `.Label` `.Separator` `.Sub` `.SubTrigger` `.SubContent` |
| `Menubar` | `.Menu` `.Trigger` `.Content` `.Item` `.Group` `.Label` `.Separator` `.Sub` `.SubTrigger` `.SubContent` |
| `NavigationMenu` | `.List` `.Item` `.Trigger` `.Content` `.Link` `.Indicator` `.Viewport` |
| `InputGroup` | `.Text` `.Addon` |
| `Breadcrumb` | `.Item` `.Separator` `.Ellipsis` |
| `Stepper` | `.Step` `.Trigger` `.Content` `.Separator` |
| `Collapsible` | `.Trigger` `.Content` |
| `Resizable` | `.Panel` `.Handle` |
| `Sidebar` | (çok sayıda alt bileşen) |
| `FileManager` | (çok sayıda alt bileşen) |

**Tekil bileşenler (alt bileşen API'si YOK):**
`Select`, `MultiSelect`, `NativeSelect`, `Alert`, `Empty`, `Accordion`, `Button`, `Badge`, `Input`, `Textarea`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `Spinner`, `Skeleton`, `Separator`, `Progress`, `Toast`, `Notification`, `Tooltip`, `Avatar`, `Typewriter`, `Typography`, `Kbd`, `Label`, `Link`, `SpeedDial`, `ButtonGroup`, `DataTable`, `DatePicker`, `DateTimePicker`, `Calendar`, `InputOTP`, `TreeView`, `Pagination`, `MediaImage`, `MediaVideo`, `Carousel`, `AspectRatio`, `ScrollArea`

**Tema — React bileşeni yoktur.** Tema yönetimi için `toggleTheme()` ve `setTheme()` utility fonksiyonları kullanılır.

---

## Bileşen Seçim Tablosu

| İhtiyaç | Kullan |
|---------|--------|
| Aksiyon butonu | `Button` |
| Buton grubu | `ButtonGroup` |
| Hızlı aksiyon menüsü | `SpeedDial` |
| Metin input | `Input` — `icon`, `iconRight`, `state` prop'larıyla |
| Prefix/Suffix'li input | `InputGroup` + `InputGroup.Text`/`InputGroup.Addon` |
| Büyük metin alanı | `Textarea` |
| Dropdown seçim | `Select` — `options` prop'uyla |
| Çoklu seçim | `MultiSelect` |
| Native HTML select | `NativeSelect` |
| Checkbox | `Checkbox` / `CheckboxGroup` |
| Radio | `Radio` / `RadioGroup` |
| Toggle (açık/kapalı) | `Switch` |
| Tarih seçici | `DatePicker` / `DateTimePicker` / `Calendar` |
| OTP kodu | `InputOTP` |
| Label | `Label` — `htmlFor` ile |
| Klavye kısayolu | `Kbd` |
| Veri tablosu (sıralama/filtre) | `DataTable` |
| Basit HTML tablosu | `Table` |
| Akordeon | `Accordion` — `title` prop'uyla |
| Sekmeler | `Tabs` |
| Ağaç yapısı | `TreeView` |
| Rozet | `Badge` |
| Avatar | `Avatar` |
| Boş durum | `Empty` — `icon`, `title`, `description`, `action` prop'larıyla |
| Tooltip | `Tooltip` |
| Tipografi | `Typography` |
| Çizgi grafik | `LineChart` |
| Bar grafik | `BarChart` |
| Alan grafik | `AreaChart` |
| Pasta grafik | `PieChart` |
| Halka grafik | `DonutChart` |
| Radar grafik | `RadarChart` |
| Radial bar grafik | `RadialChart` |
| Modal | `Dialog` |
| Yan panel (çekmece) | `Drawer` |
| Dropdown menü | `Dropdown` |
| Onay iletişim kutusu | `AlertDialog` |
| Sağ tık menüsü | `ContextMenu` |
| Küçük açılır içerik | `Popover` |
| Hover bilgi kutusu | `HoverCard` |
| Komut paleti | `Command` |
| Uyarı / callout | `Alert` — `title`, `icon`, `color`, `variant`, `dismissible` prop'larıyla |
| Bildirim | `Notification` |
| Toast | `Toast` |
| İlerleme çubuğu | `Progress` |
| Yükleniyor göstergesi | `Spinner` |
| İskelet yükleme | `Skeleton` |
| Navigasyon menüsü | `NavigationMenu` |
| Menü çubuğu | `Menubar` |
| Sayfalandırma | `Pagination` |
| Adım akışı | `Stepper` |
| Ekmek kırıntısı | `Breadcrumb` |
| Sidebar | `Sidebar` |
| Ayırıcı çizgi | `Separator` |
| Daraltılabilir alan | `Collapsible` |
| Aspect Ratio | `AspectRatio` |
| Kaydırma alanı | `ScrollArea` |
| Yeniden boyutlandırılabilir | `Resizable` |
| Tema değiştir | `toggleTheme()` / `setTheme()` — utility fonksiyonlar, bileşen değil |
| Görsel | `MediaImage` |
| Video | `MediaVideo` |
| Carousel | `Carousel` |
| Dosya tarayıcı | `FileManager` |
| Yazı animasyonu | `Typewriter` |

---

## Temel Kalıplar

```tsx
// ✅ Doğru icon import — hepsi Icon sufixiyle
import { SearchIcon, ChevronDownIcon, XIcon, CheckIcon } from "eglador-ui-react"

// ❌ Yanlış — bu isimler yok
import { Search, ChevronDown, X } from "eglador-ui-react"
```

```tsx
// ✅ Button loading — dahili prop, Spinner gerekmez
<Button loading>Kaydediliyor...</Button>
<Button loading color="primary">Gönder</Button>

// ✅ Button soft renk tonu — soft boolean prop'u
<Button soft color="primary">Soft Primary</Button>

// ❌ Yanlış — soft bir variant değil
<Button variant="soft" color="primary">...</Button>
```

```tsx
// ✅ Select — tekil bileşen, options prop'uyla
<Select
  value={value}
  onChange={(val) => setValue(val)}
  options={[
    { label: "Türkiye", value: "tr" },
    { label: "Almanya", value: "de" },
  ]}
  placeholder="Seç..."
/>

// ❌ Yanlış — Select'in alt bileşenleri yok
<Select>
  <Select.Trigger />
  <Select.Content>
    <Select.Item value="tr">Türkiye</Select.Item>
  </Select.Content>
</Select>
```

```tsx
// ✅ Alert — tekil bileşen, title prop'uyla
<Alert color="warning" title="Dikkat" dismissible>
  Bu işlem geri alınamaz.
</Alert>

// ✅ İkonlu alert
import { WarningIcon } from "eglador-ui-react"
<Alert color="danger" icon={<WarningIcon />} title="Hata">
  Sunucuya bağlanılamadı.
</Alert>

// ❌ Yanlış — Alert'in alt bileşenleri yok
<Alert><Alert.Title>Hata</Alert.Title></Alert>
```

```tsx
// ✅ Empty — tekil bileşen
import { Empty, Button, FolderIcon } from "eglador-ui-react"

<Empty
  icon={<FolderIcon />}
  title="Henüz dosya yok"
  description="İlk dosyanı yükleyerek başla."
  action={<Button color="primary">Dosya Yükle</Button>}
/>

// ❌ Yanlış — Empty'nin alt bileşenleri yok
<Empty>
  <Empty.Header>...</Empty.Header>
</Empty>
```

```tsx
// ✅ Accordion — tekil bileşen, title prop'u zorunlu
<Accordion title="Sıkça Sorulan Sorular" variant="bordered">
  Cevap içeriği burada yer alır.
</Accordion>

// ❌ Yanlış — alt bileşen yok
<Accordion>
  <Accordion.Item>...</Accordion.Item>
</Accordion>
```

```tsx
// ✅ InputGroup — Text (statik metin) ve Addon (buton/aksiyon) ile
import { InputGroup, Input } from "eglador-ui-react"

// Prefix text
<InputGroup>
  <InputGroup.Text>https://</InputGroup.Text>
  <Input placeholder="alan-adi" />
</InputGroup>

// Suffix buton
<InputGroup>
  <Input placeholder="Ara..." />
  <InputGroup.Addon>
    <Button icon={<SearchIcon />} />
  </InputGroup.Addon>
</InputGroup>

// ❌ Yanlış — InputGroup.Input diye bir alt bileşen yok
<InputGroup>
  <InputGroup.Input placeholder="..." />
</InputGroup>
```

```tsx
// ✅ Grafik — ayrı named export'lar
import { LineChart, BarChart, AreaChart, PieChart } from "eglador-ui-react"

<BarChart
  data={[
    { ay: "Oca", gelir: 4000, gider: 2400 },
    { ay: "Şub", gelir: 3000, gider: 1398 },
  ]}
  series={[
    { dataKey: "gelir", name: "Gelir", color: "#3b82f6" },
    { dataKey: "gider", name: "Gider", color: "#ef4444" },
  ]}
  xAxis={{ dataKey: "ay" }}
  height={300}
/>

// ❌ Yanlış — Chart diye tek bir bileşen yok
<Chart type="bar" data={...} />
```

```tsx
// ✅ Dialog — composition API
<Dialog>
  <Dialog.Trigger asChild>
    <Button>Aç</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Başlık</Dialog.Title>
      <Dialog.Description>Açıklama</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>İçerik</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Kapat</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

```tsx
// ✅ AlertDialog — color prop ve Header içine title
<AlertDialog color="danger">
  <AlertDialog.Trigger asChild>
    <Button color="danger">Sil</Button>
  </AlertDialog.Trigger>
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
        <Button color="danger">Sil</Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog>
```

```tsx
// ✅ cn() ile koşullu sınıf
import { cn } from "eglador-ui-react"

<div className={cn("flex items-center", isActive && "bg-zinc-100")}>

// ❌ Template literal ternary
<div className={`flex items-center ${isActive ? "bg-zinc-100" : ""}`}>
```

---

## Dahili Kancalar (Hooks)

```tsx
import {
  useAutoFlip,
  useBodyScrollLock,
  useClickOutside,
  useEscapeClose,
} from "eglador-ui-react"

// Popover/dropdown'ı viewport'tan taşmadan konumlandır
const side = useAutoFlip(triggerRef, contentRef, "bottom")
// FlipSide: "top" | "bottom" | "left" | "right"

// Overlay açıkken body scroll'ı kilitle
useBodyScrollLock(isOpen)

// Dışarı tıklandığında kapat
useClickOutside(ref, () => setOpen(false), isOpen)

// Escape tuşuyla kapat
useEscapeClose(() => setOpen(false), isOpen)
```

---

## Detaylı Referanslar

- [rules/styling.md](./rules/styling.md) — cn(), spacing, boyutlandırma, dark mode
- [rules/composition.md](./rules/composition.md) — Composition API tablosu, overlay seçimi
- [rules/forms.md](./rules/forms.md) — Input, InputGroup, Select, MultiSelect, validation
- [rules/icons.md](./rules/icons.md) — Tam ikon listesi, kullanım şekli
- [rules/charts.md](./rules/charts.md) — LineChart, BarChart vb. props ve veri yapısı
- [rules/carousel.md](./rules/carousel.md) — Carousel props, plugin'ler, responsive, efektler
- [rules/fileManager.md](./rules/fileManager.md) — FileManager sub-component'ler, FileManagerItem tipi
- [rules/imageCropper.md](./rules/imageCropper.md) — ImageCropper props, AutoCropSize, CropResult, Sharp entegrasyonu
- [rules/dataTable.md](./rules/dataTable.md) — DataTable local/remote mod, column tanımı, filtreleme, seçim, sticky
- [rules/theme.md](./rules/theme.md) — toggleTheme, setTheme, data-theme attribute, next-themes entegrasyonu
- [customization.md](./customization.md) — Tailwind v4 light-dark() sistemi, özel token ekleme, wrapper bileşen pattern
