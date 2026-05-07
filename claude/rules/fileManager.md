# FileManager Bileşeni

Dosya ve klasör yönetimi için tam özellikli bir bileşen. Grid/liste görünümü, klasör gezintisi, seçim, sıralama, arama, sürükle-bırak ve sağ tık menüsü dahili olarak gelir.

## Sub-component'ler

```tsx
import { FileManager } from "eglador-ui-react"

// Sub-component'ler:
// FileManager.Toolbar   — breadcrumb, arama, görünüm toggle, yeni klasör, yükleme
// FileManager.Sidebar   — klasör ağacı
// FileManager.Content   — dosya/klasör grid veya liste
// FileManager.Preview   — seçili öğe önizlemesi
// FileManager.StatusBar — seçim sayısı, toplam öğe bilgisi
// FileManager.GridItem  — özel grid öğesi render'ı
// FileManager.ListItem  — özel liste öğesi render'ı
// FileManager.DropZone  — sürükle-bırak upload alanı
```

---

## FileManagerItem Tipi

Her dosya ve klasör şu yapıda temsil edilir:

```typescript
interface FileManagerItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;           // örn: "image/png", "application/pdf"
  size?: number;               // byte cinsinden
  modifiedAt?: string | Date;
  thumbnailUrl?: string;       // grid görünümünde gösterilecek önizleme
  icon?: React.ReactNode;      // özel ikon (yoksa mimeType'a göre otomatik)
  parentId?: string | null;    // klasör hiyerarşisi için
  meta?: Record<string, unknown>; // ek veri
}
```

---

## Props

```typescript
interface FileManagerProps {
  items: FileManagerItem[];              // zorunlu — tüm dosya ve klasörler

  // Klasör navigasyonu
  currentFolderId?: string | null;       // controlled
  defaultFolderId?: string | null;       // uncontrolled varsayılan
  onNavigate?: (folderId: string | null) => void;

  // Görünüm
  view?: "grid" | "list";               // controlled
  defaultView?: "grid" | "list";        // varsayılan: "grid"
  onViewChange?: (view: "grid" | "list") => void;

  // Seçim
  selectedIds?: string[];               // controlled
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  selectable?: boolean;                 // varsayılan: true
  multiSelect?: boolean;                // varsayılan: true

  // Sıralama
  sortField?: "name" | "size" | "modifiedAt" | "type";
  sortDirection?: "asc" | "desc";
  onSortChange?: (field, direction) => void;

  // UI
  showSidebar?: boolean;
  showPreview?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  searchable?: boolean;
  dropZone?: boolean;
  size?: "sm" | "md";                   // varsayılan: "md"
  emptyMessage?: string;

  // Aksiyon callback'leri
  onRename?: (item: FileManagerItem) => void;
  onDelete?: (items: FileManagerItem[]) => void;
  onDownload?: (items: FileManagerItem[]) => void;
  onCopy?: (items: FileManagerItem[]) => void;
  onMove?: (items: FileManagerItem[]) => void;
  onDetails?: (item: FileManagerItem) => void;
  onCreateFolder?: (parentId: string | null) => void;
  onUpload?: (files: File[], parentId: string | null) => void;
  onFileOpen?: (item: FileManagerItem) => void;

  // Özel render
  renderItem?: (item: FileManagerItem, view: "grid" | "list") => React.ReactNode;
  renderPreview?: (item: FileManagerItem) => React.ReactNode;

  className?: string;
}
```

---

## Temel Kullanım

```tsx
import { FileManager } from "eglador-ui-react"

const items: FileManagerItem[] = [
  { id: "1", name: "Belgeler", type: "folder", parentId: null },
  { id: "2", name: "Görseller", type: "folder", parentId: null },
  { id: "3", name: "rapor.pdf", type: "file", mimeType: "application/pdf", size: 204800, parentId: "1" },
  { id: "4", name: "logo.png", type: "file", mimeType: "image/png", size: 51200, thumbnailUrl: "/logo.png", parentId: "2" },
]

<FileManager
  items={items}
  defaultView="grid"
  searchable
  showSidebar
  showToolbar
  showStatusBar
  onFileOpen={(item) => console.log("Açıldı:", item.name)}
  onDelete={(items) => console.log("Silindi:", items.map(i => i.name))}
  onCreateFolder={(parentId) => console.log("Yeni klasör, parent:", parentId)}
  onUpload={(files, parentId) => console.log("Yüklendi:", files, "parent:", parentId)}
>
  <FileManager.Toolbar />
  <div className="flex flex-1 overflow-hidden">
    <FileManager.Sidebar />
    <FileManager.Content />
    <FileManager.Preview />
  </div>
  <FileManager.StatusBar />
</FileManager>
```

---

## Controlled Navigasyon

```tsx
const [folderId, setFolderId] = React.useState<string | null>(null)
const [selectedIds, setSelectedIds] = React.useState<string[]>([])

<FileManager
  items={items}
  currentFolderId={folderId}
  onNavigate={setFolderId}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
>
  <FileManager.Toolbar />
  <FileManager.Content />
</FileManager>
```

---

## Sidebar Genişliği Özelleştirme

```tsx
// FileManager.Sidebar width prop'u ile genişlik ayarla
<FileManager.Sidebar width="w-64" />
// varsayılan: "w-52"
```

---

## Özel Öğe Render'ı

```tsx
<FileManager
  items={items}
  renderItem={(item, view) => (
    <div className="custom-item">
      <span>{item.name}</span>
      {item.type === "file" && <span>{item.size} byte</span>}
    </div>
  )}
>
  <FileManager.Content />
</FileManager>
```

---

## DropZone

Sürükle-bırak ile dosya yükleme için `dropZone` prop'unu ve `onUpload` callback'ini tanımla:

```tsx
<FileManager
  items={items}
  dropZone
  onUpload={(files, parentId) => handleUpload(files, parentId)}
>
  <FileManager.Toolbar />
  <FileManager.Content />
  <FileManager.DropZone />
</FileManager>
```

---

## İkon Otomatik Atama

`item.icon` prop'u yoksa `mimeType`'a göre dahili ikon atanır:

| mimeType | Gösterilen ikon |
|----------|-----------------|
| `image/*` | `FileImageIcon` |
| `text/*`, `application/pdf` | `FileTextIcon` |
| `folder` tipi | `FolderIcon` |
| Diğerleri | `FileIcon` |
