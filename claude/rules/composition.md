# Bileşen Composition

## İçindekiler

- Composition API doğru kullanımı
- Tekil bileşenler (alt bileşen yok)
- Overlay bileşen seçimi
- Button loading prop'u
- Alert kullanımı
- Empty kullanımı
- Tabs kullanımı
- Dialog kullanımı
- AlertDialog kullanımı
- Separator, Skeleton, Badge

---

## Composition API — Doğru Kullanım

eglador-ui-react, sub-component'leri `Object.assign` ile parent'a bağlar. Her zaman parent üzerinden eriş; ayrıca alt bileşen import etme.

**Yanlış:**

```tsx
// Bu export'lar YOKTUR — import hata verir
import { TableHead, TableBody, TableRow } from "eglador-ui-react"
import { CommandInput, CommandList, CommandGroup } from "eglador-ui-react"
import { DialogTrigger, DialogContent, DialogTitle } from "eglador-ui-react"
```

**Doğru:**

```tsx
import { Table, Command, Dialog } from "eglador-ui-react"

// Table
<Table size="sm" variant="striped">
  <Table.Head>
    <Table.Row>
      <Table.Header>Ad</Table.Header>
      <Table.Header align="right">Tutar</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Ali Yıldız</Table.Cell>
      <Table.Cell align="right">₺1.250</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
// Table.Header / Table.Cell align: "left" | "center" | "right"
// Table variant: "default" | "bordered" | "striped"
// Table size: "xs" | "sm" | "md"
// Table shape: "square" | "rounded"
```

---

## Tekil Bileşenler — Alt Bileşen Yok

Aşağıdaki bileşenler composition API kullanmaz. Alt bileşen yazma veya bekleme.

### Alert

```tsx
import { Alert, WarningIcon } from "eglador-ui-react"

// Temel kullanım
<Alert color="warning" title="Dikkat">
  Bu işlem geri alınamaz.
</Alert>

// İkonlu
<Alert
  variant="filled"
  color="danger"
  icon={<WarningIcon />}
  title="Bağlantı Hatası"
  dismissible
  onDismiss={() => console.log("dismissed")}
>
  Sunucuya bağlanılamadı.
</Alert>

// variant: "soft" | "outline" | "filled"
// color: "default" | "primary" | "danger" | "success" | "warning" | "info"
// size: "xs" | "sm" | "md"
// shape: "square" | "rounded"

// ❌ Yanlış
<Alert><Alert.Title>Hata</Alert.Title></Alert>
```

### Empty

```tsx
import { Empty, Button, FolderIcon } from "eglador-ui-react"

<Empty
  icon={<FolderIcon />}
  title="Henüz dosya yok"
  description="İlk dosyanı yükleyerek başla."
  size="md"
  action={<Button color="primary">Dosya Yükle</Button>}
/>
// size: "sm" | "md" | "lg"
// icon varsayılanı: InboxIcon

// ❌ Yanlış
<Empty><Empty.Header>...</Empty.Header></Empty>
```

### Accordion

```tsx
import { Accordion } from "eglador-ui-react"

// defaultOpen varsayılan değeri true'dur — accordion başlangıçta açık gelir
<Accordion
  title="Ödeme nasıl yapılır?"
  variant="bordered"
  size="sm"
>
  Kredi kartı veya havale ile ödeme yapabilirsiniz.
</Accordion>

// Kapalı başlatmak için
<Accordion title="Gizli bölüm" defaultOpen={false}>
  İçerik
</Accordion>

// controlled
<Accordion
  title="Açık/kapalı"
  open={isOpen}
  onOpenChange={setIsOpen}
>
  İçerik
</Accordion>

// variant: "default" | "bordered" | "filled"
// size: "xs" | "sm" | "md"
// shape: "square" | "rounded"
// Ayrıca: icon, extra, hideChevron, disabled

// ❌ Yanlış
<Accordion><Accordion.Item /></Accordion>
```

---

## Button Loading Prop'u

`Button`'ın dahili `loading` prop'u vardır. Ayrıca `Spinner` compose etmek gerekmez.

```tsx
// ✅ Doğru — loading prop'u ile
<Button loading>Kaydediliyor...</Button>
<Button loading color="primary">Gönderiliyor...</Button>

// loading=true iken button otomatik olarak:
// - Dahili spinner gösterir
// - disabled hale gelir (ayrıca disabled prop yazma)

// Eğer özel spinner kontrolü istiyorsan Spinner bileşenini compose edebilirsin
import { Spinner } from "eglador-ui-react"
<Button disabled><Spinner /> Özel Spinner</Button>
```

---

## Overlay Bileşen Seçimi

| Durum | Bileşen |
|-------|---------|
| Girdi gerektiren odaklanmış görev | `Dialog` |
| Yıkıcı aksiyon onayı | `AlertDialog` |
| Yan panel, detay, filtre | `Drawer` |
| Küçük bağlamsal içerik (tıkla) | `Popover` |
| Hover bilgi kutusu | `HoverCard` |
| Komut / arama paleti | `Command` |
| Sağ tık menüsü | `ContextMenu` |
| Basit dropdown menü | `Dropdown` |

---

## Dialog Yapısı

```tsx
import { Dialog, Button } from "eglador-ui-react"

// Uncontrolled
<Dialog>
  <Dialog.Trigger asChild>
    <Button>Profili Düzenle</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Profil Düzenle</Dialog.Title>
      <Dialog.Description>Profil bilgilerini güncelle.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>
      {/* form içeriği */}
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">İptal</Button>
      </Dialog.Close>
      <Button color="primary">Kaydet</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>

// Controlled
<Dialog open={open} onOpenChange={setOpen} size="lg">
  ...
</Dialog>
// size: "sm" | "md" | "lg"
// Dialog.Header ayrıca icon prop'u alır
```

---

## AlertDialog Yapısı

AlertDialog'un `color` prop'u yalnızca şu üç değeri alır: `"default"`, `"danger"`, `"warning"`.

`AlertDialog.Header` içine doğrudan başlık metni veya icon prop'u yaz — ayrıca `.Title` sub-component'i yoktur.

```tsx
import { AlertDialog, Button, TrashIcon } from "eglador-ui-react"

<AlertDialog color="danger">
  <AlertDialog.Trigger asChild>
    <Button color="danger" variant="outline">Hesabı Sil</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header icon={<TrashIcon />}>
      Hesabını silmek istediğine emin misin?
    </AlertDialog.Header>
    <AlertDialog.Description>
      Bu işlem kalıcıdır ve geri alınamaz.
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

## Tabs Yapısı

```tsx
import { Tabs } from "eglador-ui-react"

<Tabs defaultValue="genel" variant="default">
  <Tabs.List>
    <Tabs.Trigger value="genel">Genel</Tabs.Trigger>
    <Tabs.Trigger value="guvenlik">Güvenlik</Tabs.Trigger>
    <Tabs.Trigger value="bildirim" disabled>Bildirimler</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="genel">Genel ayarlar içeriği</Tabs.Content>
  <Tabs.Content value="guvenlik">Güvenlik ayarları</Tabs.Content>
  <Tabs.Content value="bildirim">Bildirim ayarları</Tabs.Content>
</Tabs>

// variant: "default" | "bordered" | "segmented"
// size: "xs" | "sm" | "md"
// Controlled: value + onValueChange

// ❌ Tabs.Trigger doğrudan Tabs içine koyma
<Tabs>
  <Tabs.Trigger value="genel">Genel</Tabs.Trigger>  {/* yanlış */}
</Tabs>
```

---

## Separator, Skeleton, Badge

```tsx
// ✅ Separator — <hr> ve <div className="border-t"> yerine
import { Separator } from "eglador-ui-react"
<Separator />                          // horizontal solid
<Separator orientation="vertical" />
<Separator variant="dashed" label="veya" />
// variant: "solid" | "dashed" | "dotted"

// ✅ Skeleton — animate-pulse div yerine
import { Skeleton } from "eglador-ui-react"
<Skeleton className="h-4 w-3/4" />
<Skeleton variant="circular" className="size-12" />
<Skeleton variant="rectangular" className="h-32 w-full" />
// variant: "text" | "circular" | "rectangular" | "rounded"
// animation: "pulse" | "wave" | "none"

// ✅ Badge — styled span yerine
import { Badge } from "eglador-ui-react"
<Badge color="success">Aktif</Badge>
<Badge variant="outline" color="warning">Beklemede</Badge>
<Badge shape="pill" color="danger" removable onRemove={() => {}}>Silinebilir</Badge>
// variant: "solid" | "soft" | "outline"
// color: "default" | "black" | "primary" | "danger" | "success" | "warning" | "info"
// shape: "square" | "rounded" | "pill"
```

---

## Breadcrumb

Sub-component'ler: `.Item`, `.Separator`, `.Ellipsis` — **`.Link` ve `.Page` yoktur.**

- Link için `href` prop kullan veya `asChild` ile custom link sarı bileşen ver.
- Aktif/mevcut sayfa için `isActive` prop kullan — ayrı sub-component yok.
- Separator otomatik eklenir; manuel kontrol gerekirse `Breadcrumb.Separator` kullan.

```tsx
import { Breadcrumb } from "eglador-ui-react"

// Temel kullanım — separator otomatik eklenir
<Breadcrumb>
  <Breadcrumb.Item href="/">Ana Sayfa</Breadcrumb.Item>
  <Breadcrumb.Item href="/urunler">Ürünler</Breadcrumb.Item>
  <Breadcrumb.Item isActive>Detay</Breadcrumb.Item>
</Breadcrumb>

// Özel separator
<Breadcrumb separator={<span>/</span>}>
  <Breadcrumb.Item href="/">Ana Sayfa</Breadcrumb.Item>
  <Breadcrumb.Item isActive>Sayfa</Breadcrumb.Item>
</Breadcrumb>

// Orta öğeleri gizlemek için Ellipsis
<Breadcrumb>
  <Breadcrumb.Item href="/">Ana Sayfa</Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
  <Breadcrumb.Item href="/kategori/alt">Alt Kategori</Breadcrumb.Item>
  <Breadcrumb.Item isActive>Mevcut Sayfa</Breadcrumb.Item>
</Breadcrumb>

// asChild ile custom link (Next.js Link, React Router Link vb.)
<Breadcrumb>
  <Breadcrumb.Item asChild>
    <Link href="/">Ana Sayfa</Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item isActive>Detay</Breadcrumb.Item>
</Breadcrumb>

// ❌ Yanlış — bu sub-component'ler yok
<Breadcrumb>
  <Breadcrumb.Link href="/">...</Breadcrumb.Link>   {/* yok */}
  <Breadcrumb.Page>Aktif</Breadcrumb.Page>           {/* yok */}
</Breadcrumb>
```

---

## Command Paleti

`Command.Item` her zaman `Command.Group` içinde olmalıdır.

```tsx
import { Command, SearchIcon, UserIcon } from "eglador-ui-react"

<Command open={open} onOpenChange={setOpen}>
  <Command.Input placeholder="Komut ara..." />
  <Command.List>
    <Command.Group heading="Sayfalar">
      <Command.Item
        icon={<UserIcon />}
        shortcut="⌘P"
        onSelect={() => navigate("/profil")}
        keywords={["profil", "hesap", "kullanıcı"]}
      >
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
</Command>

// ❌ Command.Item doğrudan Command.List içine koyma
<Command.List>
  <Command.Item>Yanlış</Command.Item>
</Command.List>
```
