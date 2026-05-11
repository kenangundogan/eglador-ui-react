# İkonlar

## Dahili İkon Sistemi

eglador-ui-react **tüm ikon isimlerini `Icon` sufixiyle export eder**. Dış kütüphane (lucide-react, @tabler/icons-react) gerekmez.

```tsx
import {
  // Chevron'lar
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,

  // Aksiyonlar
  XIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  ExternalLinkIcon,

  // UI
  EllipsisIcon,
  DotIcon,
  GripVerticalIcon,
  GripHorizontalIcon,
  ColumnsIcon,
  PanelLeftIcon,

  // Medya & İçerik
  CalendarIcon,
  CalendarClockIcon,
  CameraIcon,
  VideoIcon,
  FileIcon,
  InboxIcon,
  UserIcon,

  // Durum / Feedback
  InfoIcon,
  WarningIcon,
  ErrorIcon,
  SuccessIcon,

  // Dosya Yöneticisi
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  UploadIcon,
  DownloadIcon,
  TrashIcon,
  PencilIcon,
  CopyIcon,
  GridIcon,
  ListIcon,
  FileTextIcon,
  FileImageIcon,
} from "eglador-ui-react"
```

---

## Doğru İkon İsimleri

**Yanlış:**

```tsx
// Bu isimler YOKTUR
import { Search, ChevronDown, X, Check, Warning } from "eglador-ui-react"
```

**Doğru:**

```tsx
// Tüm isimler Icon sufixiyle biter
import { SearchIcon, ChevronDownIcon, XIcon, CheckIcon, WarningIcon } from "eglador-ui-react"
```

---

## Bileşen İçinde İkon Kullanımı

Bileşenlerin `icon` ve `iconRight` prop'larını kullan. İkon boyutu bileşen tarafından otomatik yönetilir — `size-4`, `w-4 h-4` gibi boyutlandırma sınıfı ekleme.

**Yanlış:**

```tsx
<Button>
  <SearchIcon className="size-4 mr-2" />
  Ara
</Button>
```

**Doğru:**

```tsx
import { Button, Input, SearchIcon, ChevronDownIcon } from "eglador-ui-react"

// Button
<Button icon={<SearchIcon />}>Ara</Button>
<Button icon={<SearchIcon />} iconRight={<ChevronDownIcon />}>Filtrele</Button>

// Yalnızca ikon (kare/daire buton)
<Button shape="circle" icon={<SearchIcon />} />
<Button shape="square" size="xs" icon={<XIcon />} />

// Input
<Input icon={<SearchIcon />} placeholder="Ara..." />
<Input iconRight={<ChevronDownIcon />} placeholder="..." />
```

---

## İkonu Component Objesi Olarak Geçir

```tsx
// ✅ Component objesi doğrudan
import { CheckIcon, ErrorIcon } from "eglador-ui-react"

function StatusIcon({ icon: Icon }: { icon: React.ComponentType }) {
  return <Icon />
}

<StatusIcon icon={CheckIcon} />
<StatusIcon icon={ErrorIcon} />

// ❌ String key ile lookup map
const iconMap = { check: CheckIcon }
<StatusIcon icon="check" />
```

---

## strokeWidth Özelleştirme

Tüm ikonlar `strokeWidth` prop'u kabul eder:

```tsx
<ChevronDownIcon strokeWidth={1} />   // ince
<ChevronDownIcon strokeWidth={2} />   // varsayılan
<ChevronDownIcon strokeWidth={3} />   // kalın
```

---

## Bağımsız İkon Kullanımı

Bir bileşen prop'u olarak değil de bağımsız render edildiğinde Tailwind sınıflarıyla boyutlandır:

```tsx
// Serbest kullanım — boyut ve renk className ile
<SearchIcon className="size-5 text-zinc-400" />
<CheckIcon className="size-6 text-green-500" />
<WarningIcon className="size-4 text-yellow-500" strokeWidth={2.5} />
```
