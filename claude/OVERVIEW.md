# Eglador Skill — Kapsamlı Genel Bakış

Bu klasör, `eglador-ui-react` bileşen kütüphanesiyle çalışan projelerde AI agent'ların (Antigravity vb.) doğru kod üretmesini sağlayan bir **skill (beceri) paketidir**. Skill okununca agent, kütüphaneyi derin şekilde öğrenmiş bir geliştirici gibi davranır.

---

## Neden Var? — Skill Olmadan Ne Olur?

`eglador-ui-react` kendi composition API'sine, kendi ikon sistemine ve kendi stil mantığına sahip bir kütüphanedir. Herhangi bir AI agent bu kütüphaneyi doğrudan tanımaz. Skill olmadan agent şu hataları yapar:

### ❌ Hata 1 — Yanlış Composition API Kullanımı

Agent, `Table` bileşenini Radix/shadcn tarzı sub-component export'ları olduğunu varsayarak şunu yazar:

```tsx
// ❌ Bu import'lar YOKTUR — runtime'da hata verir
import { TableHead, TableBody, TableRow, TableCell } from "eglador-ui-react"
```

Oysa doğrusu:

```tsx
// ✅ Sub-component'ler parent üzerinden nokta notasyonuyla erişilir
import { Table } from "eglador-ui-react"

<Table variant="striped">
  <Table.Head>
    <Table.Row>
      <Table.Header>Ürün</Table.Header>
      <Table.Header align="right">Fiyat</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Laptop</Table.Cell>
      <Table.Cell align="right">₺24.999</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

---

### ❌ Hata 2 — Tekil Bileşene Alt Bileşen Yazmak

Bileşenin `Select` olduğunu bilen agent, Radix Select alışkanlığıyla şunu yazar:

```tsx
// ❌ Select'in .Trigger, .Content, .Item alt bileşenleri YOKTUR
<Select>
  <Select.Trigger placeholder="Ülke seç..." />
  <Select.Content>
    <Select.Group>
      <Select.Item value="tr">Türkiye</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>
```

Oysa `Select` tekil bir bileşendir:

```tsx
// ✅ Doğru — options prop'uyla çalışır
<Select
  value={value}
  onChange={(val) => setValue(val)}
  options={[
    { label: "Türkiye", value: "tr" },
    { label: "Almanya", value: "de" },
    { label: "Fransa", value: "fr" },
  ]}
  placeholder="Ülke seç..."
/>
```

Aynı sorun şu bileşenlerde de olur: `Alert`, `Empty`, `Accordion`, `Badge`, `MultiSelect`, `InputOTP`, `Skeleton`, `Separator`, `Spinner`, `Progress`, `Tooltip` vb.

---

### ❌ Hata 3 — Dış İkon Kütüphanesi Import Etmek

Agent, `lucide-react` veya `@tabler/icons-react` kullandığını varsayarak:

```tsx
// ❌ Yanlış — dış kütüphane
import { Search, Trash2, ChevronDown } from "lucide-react"
```

Bu kütüphanede tüm ikonlar **`eglador-ui-react`'tan** gelir ve **`Icon` sufixiyle** biter:

```tsx
// ✅ Doğru — dahili ikon sistemi (40+ ikon)
import { SearchIcon, TrashIcon, ChevronDownIcon } from "eglador-ui-react"
```

Ayrıca agent yanlışlıkla sufixsiz isimler kullanabilir:

```tsx
// ❌ Bu isimler YOKTUR
import { Search, Trash, ChevronDown, X, Check, Warning } from "eglador-ui-react"

// ✅ Doğru isimler
import { SearchIcon, TrashIcon, ChevronDownIcon, XIcon, CheckIcon, WarningIcon } from "eglador-ui-react"
```

---

### ❌ Hata 4 — Grafiğe `<Chart type="...">` Yazmak

Agent, kütüphanede tek bir `Chart` bileşeni olduğunu varsayarak:

```tsx
// ❌ Chart diye tek bir bileşen YOKTUR
import { Chart } from "eglador-ui-react"
<Chart type="bar" data={salesData} />
```

Her grafik türü **ayrı** bileşendir:

```tsx
// ✅ Doğru
import { BarChart, LineChart, AreaChart, PieChart } from "eglador-ui-react"

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
  legend
/>
```

Ayrıca Recharts'ı doğrudan import etmek de hatalıdır:

```tsx
// ❌ Recharts doğrudan import etme
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
```

---

### ❌ Hata 5 — `className` ile Renk Override Yazmak

Agent, bileşenin rengini `className` ile değiştirmeye çalışır:

```tsx
// ❌ Yanlış — renk override
<Button className="bg-blue-500 text-white hover:bg-blue-600">Kaydet</Button>
<Badge className="rounded-full bg-green-100 text-green-800 text-xs">Aktif</Badge>
<Alert className="bg-yellow-50 border border-yellow-200 text-yellow-800">Dikkat!</Alert>
```

Bu kütüphanede renkler `variant` ve `color` prop'larıyla yönetilir:

```tsx
// ✅ Doğru
<Button variant="solid" color="primary">Kaydet</Button>
<Badge variant="soft" color="success" shape="pill">Aktif</Badge>
<Alert color="warning" title="Dikkat!">Açıklama metni</Alert>
```

`className` yalnızca **layout** için kullanılır: `max-w-xl`, `mx-auto`, `mt-4`, `w-full` gibi.

---

### ❌ Hata 6 — `space-y-*` ile Boşluk Vermek

Agent, dikey boşluk için Tailwind'in eski utility'sini kullanır:

```tsx
// ❌ Yanlış
<div className="space-y-4">
  <Input placeholder="Ad" />
  <Input placeholder="Soyad" />
</div>
```

Bu kütüphanede `flex` + `gap-*` tercih edilir:

```tsx
// ✅ Doğru
<div className="flex flex-col gap-4">
  <Input placeholder="Ad" />
  <Input placeholder="Soyad" />
</div>
```

---

### ❌ Hata 7 — Input Üzerinde Absolute Positioned İkon Yazmak

Agent, arama ikonu olan bir input için wrapper div + absolute positioning yazar:

```tsx
// ❌ Yanlış — gereksiz wrapper
<div className="relative">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
  <input className="pl-10 border rounded-md" placeholder="Ara..." />
</div>
```

`Input` bileşeni `icon` ve `iconRight` prop'larına sahiptir:

```tsx
// ✅ Doğru
<Input placeholder="Ara..." icon={<SearchIcon />} />
<Input placeholder="Şifre" type="password" iconRight={<XIcon />} />
<Input state="error" errorMessage="Geçersiz e-posta" />
```

---

### ❌ Hata 8 — `Button` İçine Manuel `Spinner` Koymak

Agent, butonun yükleme durumu için Spinner bileşenini compose eder:

```tsx
// ❌ Yanlış — Spinner gereksiz
<Button disabled>
  <Spinner className="size-4 mr-2" />
  Kaydediliyor...
</Button>
```

`Button` bileşeni dahili `loading` prop'una sahiptir:

```tsx
// ✅ Doğru — loading prop'u butonu otomatik devre dışı bırakır ve spinner gösterir
<Button loading color="primary">Kaydediliyor...</Button>

// Ayrıca: soft renk tonu variant değil, ayrı boolean prop'tur
<Button soft color="primary">Soft Primary</Button>  // ✅
<Button variant="soft" color="primary">...</Button>  // ❌ variant="soft" yoktur
```

---

### ❌ Hata 9 — Dark Mode için `class="dark"` Eklemek

Agent, `next-themes` veya manuel dark mode için class tabanlı geçiş uygular:

```tsx
// ❌ Yanlış — class tabanlı geçiş eglador ile uyumsuz
<ThemeProvider attribute="class">
```

```tsx
// ❌ Yanlış — className toggle
document.documentElement.classList.toggle("dark")
```

Bu kütüphane **`data-theme` attribute** tabanlıdır:

```tsx
// ✅ Doğru — next-themes ile
<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>

// ✅ Doğru — manuel toggle
import { toggleTheme, setTheme } from "eglador-ui-react"

toggleTheme()        // dark ↔ light geçişi
setTheme("dark")     // direkt set etme
```

---

### ❌ Hata 10 — `AlertDialog.Title` Sub-component'i Kullanmak

Agent, Dialog ile AlertDialog'u karıştırır ve olmayan sub-component yazar:

```tsx
// ❌ AlertDialog.Title YOKTUR
<AlertDialog.Content>
  <AlertDialog.Header>
    <AlertDialog.Title>Silmek istediğine emin misin?</AlertDialog.Title>
  </AlertDialog.Header>
```

`AlertDialog.Header` içine **doğrudan metin** yazılır, `icon` prop'u ayrıca verilir:

```tsx
// ✅ Doğru
<AlertDialog color="danger">
  <AlertDialog.Trigger asChild>
    <Button color="danger">Sil</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header icon={<TrashIcon />}>
      Bu kaydı silmek istediğine emin misin?
    </AlertDialog.Header>
    <AlertDialog.Description>
      Bu işlem geri alınamaz.
    </AlertDialog.Description>
    <AlertDialog.Footer>
      <AlertDialog.Cancel asChild>
        <Button variant="outline">İptal</Button>
      </AlertDialog.Cancel>
      <AlertDialog.Action asChild>
        <Button color="danger">Evet, Sil</Button>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog>
```

---

### ❌ Hata 11 — `Command.Item`'ı Grupsuz Kullanmak

Agent, `Command.Item`'ı direkt `Command.List` içine koyar:

```tsx
// ❌ Yanlış — Command.Item her zaman Command.Group içinde olmalı
<Command.List>
  <Command.Item onSelect={() => {}}>Profil</Command.Item>
  <Command.Item onSelect={() => {}}>Ayarlar</Command.Item>
</Command.List>
```

Doğrusu:

```tsx
// ✅ Doğru
<Command.List>
  <Command.Group heading="Sayfalar">
    <Command.Item icon={<UserIcon />} shortcut="⌘P" onSelect={() => navigate("/profil")}>
      Profil
    </Command.Item>
  </Command.Group>
  <Command.Separator />
  <Command.Group heading="Aksiyonlar">
    <Command.Item icon={<SearchIcon />} onSelect={handleSearch}>
      Gelişmiş Arama
    </Command.Item>
  </Command.Group>
  <Command.Empty>Sonuç bulunamadı.</Command.Empty>
</Command.List>
```

---

### ❌ Hata 12 — `InputGroup` İçine `InputGroup.Input` Yazmak

Agent, `InputGroup` için olmayan bir sub-component kullanır:

```tsx
// ❌ InputGroup.Input diye bir bileşen YOKTUR
<InputGroup>
  <InputGroup.Input placeholder="alan-adi" />
</InputGroup>
```

Raw `Input` doğrudan `InputGroup` içine konur:

```tsx
// ✅ Doğru — Text (statik metin) ve Addon (buton/aksiyon)
<InputGroup>
  <InputGroup.Text>https://</InputGroup.Text>
  <Input placeholder="alan-adi" />
  <InputGroup.Addon>
    <Button color="primary">Kaydet</Button>
  </InputGroup.Addon>
</InputGroup>
```

---

## Skill'in Kapsamı — Hangi Konuları Yönetir?

| Kural Dosyası | Kapsam |
|---------------|--------|
| `SKILL.md` | Ana talimat — tüm kuralların özeti, composition haritası, bileşen seçim tablosu |
| `rules/composition.md` | Hangi bileşen composition API kullanır, tekil bileşen kuralları, Dialog/AlertDialog/Tabs/Command örnekleri |
| `rules/forms.md` | Input, InputGroup, Select, MultiSelect, NativeSelect, Checkbox, Radio, Switch, DatePicker, OTP, validation |
| `rules/styling.md` | `className` sadece layout, `variant`+`color` kullan, `space-y-*` yasak, `size-*`, `cn()`, dark mode override yasağı |
| `rules/icons.md` | 40+ dahili ikon listesi, `Icon` sufixi zorunluluğu, `icon`/`iconRight` prop kullanımı, `strokeWidth` |
| `rules/charts.md` | `LineChart`/`BarChart`/`AreaChart`/`PieChart`/`DonutChart`/`RadarChart`/`RadialChart` props, `series`, eksen ayarları |
| `rules/carousel.md` | `Carousel` props, `loop`, `autoplay`, `showNavigation`, `showPagination`, responsive |
| `rules/fileManager.md` | `FileManager` sub-component'leri, `FileManagerItem` tipi, `defaultView`, callback'ler |
| `rules/theme.md` | `toggleTheme()`, `setTheme()`, `data-theme` attribute, next-themes entegrasyonu |
| `customization.md` | Tailwind v4 `light-dark()` sistemi, özel token ekleme (`@theme inline`), dark mode, wrapper bileşen pattern |

---

## Klasör Yapısı

```
.agents/skills/eglador/
├── SKILL.md              # Agent'ın okuduğu ana talimat (430 satır)
├── OVERVIEW.md           # Bu dosya — geliştirici odaklı özet
├── customization.md      # Tailwind v4 light-dark() sistemi, özel token ekleme
├── agents/
│   └── openai.yml        # Agent konfigürasyonu
├── assets/
│   ├── eglador.png
│   └── eglador-small.png
├── evals/
│   └── evals.json        # 18 adet gerçek test senaryosu
└── rules/
    ├── styling.md
    ├── composition.md
    ├── forms.md
    ├── icons.md
    ├── charts.md
    ├── carousel.md
    ├── fileManager.md
    └── theme.md
```

---

## Evals — Skill Nasıl Test Edilir?

`evals/evals.json` dosyası, skill'in ne kadar doğru çalıştığını ölçen **18 test senaryosu** içerir. Her senaryo şunlardan oluşur:

- **`prompt`** — Agent'a verilen gerçekçi görev
- **`expected_output`** — Beklenen çıktının özeti
- **`expectations`** — Kontrol edilecek somut kurallar listesi

### Örnek Eval Senaryoları

**Senaryo #1 — Kullanıcı Kayıt Formu:**
> *"Ad, e-posta ve şifre alanları olsun. E-posta hatalıysa kırmızı kenarlık ve hata mesajı göstersin. Arama ikonu olan input da olsun."*

Beklenenler:
- `state="error"` prop'u kullanılır, `className="border-red-500"` yazılmaz
- `icon={<SearchIcon />}` prop'u kullanılır, absolute positioned wrapper yapılmaz
- `SearchIcon` `eglador-ui-react`'tan import edilir, `lucide-react`'tan değil
- `gap-*` ile dikey boşluk verilir, `space-y-*` kullanılmaz

**Senaryo #5 — Bar Grafik:**
> *"Ocak-Haziran arası aylık gelir-gider bar grafiği. Gelir mavi, gider kırmızı. Tooltip ve legend olsun."*

Beklenenler:
- `BarChart` `eglador-ui-react`'tan import edilir, `Chart` diye tekil bileşen kullanılmaz
- Recharts doğrudan import edilmez
- `series=[{ dataKey: "gelir", color: "#3b82f6" }]` formatı kullanılır
- `CHART_SEMANTIC_COLORS` ile renk verilebilir

**Senaryo #10 — Loading Butonu:**
> *"Butona tıklandığında loading state'e geçsin. Soft primary renkte olsun."*

Beklenenler:
- `loading={isLoading}` prop'u kullanılır, içine `<Spinner />` konmaz
- `soft` boolean prop'u kullanılır, `variant="soft"` yazılmaz
- `loading` otomatik devre dışı bıraktığı için ayrıca `disabled` yazılmaz

**Senaryo #11 — Tema Toggle:**
> *"Dark/light tema arası geçiş. Tercih localStorage'a kaydedilsin."*

Beklenenler:
- `toggleTheme()` `eglador-ui-react`'tan import edilir
- `data-theme` attribute kullanılır, `class="dark"` eklenmez
- `next-themes` varsa `attribute="data-theme"` kullanılır, `attribute="class"` değil

---

## Skill Ne Zaman Devreye Girer?

Agent şu durumlarda bu skill'i otomatik okur:

1. Projede `eglador-ui-react` import'u olan bir dosya açıldığında
2. "eglador bileşeni oluştur", "eglador ile düzelt", "eglador'da stilize et" gibi bir istek geldiğinde
3. `Table`, `Dialog`, `AlertDialog`, `Select`, `Alert`, `Accordion`, `Empty` gibi kütüphane bileşenlerinde hata çözülürken

---

## Kısa Başvuru — En Çok Karıştırılan Kurallar

| Konu | Kural |
|------|-------|
| **Sub-component import** | `Table.Head` kullan, `TableHead` import etme |
| **Select** | `options` prop'u ile çalışır, `.Trigger/.Item` sub-component'i yoktur |
| **Alert** | `title` prop'u kullan, `<Alert.Title>` sub-component'i yoktur |
| **Accordion** | `title` prop'u zorunlu, `<Accordion.Item>` yoktur |
| **Empty** | `icon`, `title`, `description`, `action` prop'ları ile çalışır |
| **Button loading** | `loading` prop'u; `Spinner` compose etme, `variant="soft"` yok, `soft` boolean |
| **İkon import** | `SearchIcon` — sufixsiz `Search` değil, `lucide-react` değil |
| **AlertDialog başlık** | `<AlertDialog.Header>` içine direkt metin yaz, `.Title` sub-component'i yok |
| **Command.Item** | Her zaman `Command.Group` içinde olmalı |
| **InputGroup input** | Raw `<Input>` koy, `<InputGroup.Input>` diye sub-component yok |
| **Grafik** | `BarChart`/`LineChart` vb., `Chart type="..."` değil, Recharts import etme |
| **Dark mode** | `toggleTheme()` / `setTheme()` kullan; `data-theme` attribute, `class="dark"` veya `classList.toggle("dark")` değil |
| **Tema bileşeni** | `Theme` adında React bileşeni yoktur — `toggleTheme()` ve `setTheme()` utility fonksiyonları kullan |
| **next-themes** | `attribute="data-theme"`, `attribute="class"` değil |
| **Renk** | `variant`+`color` prop'u, className ile `bg-*` değil |
| **Boşluk** | `flex gap-4`, `space-y-4` değil |
| **Eşit boyut** | `size-10`, `w-10 h-10` değil |
| **Koşullu sınıf** | `cn()` kullan, template literal ternary yazma |
| **Overlay z-index** | Dialog, Drawer, Dropdown kendi z-index'ini yönetir, manuel ekleme |
