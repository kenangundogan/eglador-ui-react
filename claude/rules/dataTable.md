# DataTable Bileşeni

Sıralama, filtreleme, sayfalandırma, seçim ve remote API desteği olan tam özellikli veri tablosu. Tekil bileşen — alt bileşen API'si yoktur.

## Import

```tsx
import { DataTable } from "eglador-ui-react"
```

---

## İki Mod

| Mod | Kullanım |
|-----|---------|
| **Local** | `data` prop'u — sıralama/filtreleme/sayfalandırma client-side |
| **Remote** | `endpoint` prop'u — API'ye query param gönderir, sunucu yönetir |

---

## DataTableColumn Tipi

```typescript
interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;              // doğrudan alan adı
  accessorFn?: (row: T) => unknown;   // hesaplanan değer
  cell?: (value, row, index) => React.ReactNode; // custom render
  sortable?: boolean;                 // varsayılan: true
  filterable?: boolean;               // global aramaya dahil edilsin mi
  filterType?: "text" | "select" | "number" | "date";
  filterOptions?: string[];           // select için statik seçenekler
  hideable?: boolean;                 // sütun gizlenebilir mi
  hidden?: boolean;                   // başlangıçta gizli
  width?: string;                     // "100px" gibi
  minWidth?: string;
  align?: "left" | "center" | "right";
  fixed?: "left" | "right";          // sticky sütun
}
```

---

## Props

```typescript
interface DataTableProps<T> {
  // Veri kaynağı
  data?: T[];                         // local mod
  endpoint?: string;                  // remote mod
  responseMapping?: { data: string }; // API yanıtındaki veri yolu, örn: "data" veya "data.items"
  paginationMapping?: {               // API yanıtındaki sayfalama alanları
    currentPage?: string;
    lastPage?: string;
    perPage?: string;
    total?: string;
    from?: string;
    to?: string;
  };
  addColumns?: DataTableColumn<T>[];  // API mod — sunucu sütunlarına ek sütun ekle
  columns?: DataTableColumn<T>[];     // sütun tanımları (yoksa data'dan otomatik üretilir)
  includeColumns?: string[];          // whitelist — sadece bunları göster
  excludeColumns?: string[];          // blacklist — bunları gizle
  queryParams?: Record<string, string | number>; // her isteğe eklenen sabit param'lar
  headers?: Record<string, string>;   // fetch header'ları

  // Boyut
  size?: "xs" | "sm" | "md";         // varsayılan: "sm"

  // Arama
  searchable?: boolean;               // varsayılan: false
  searchPlaceholder?: string;
  searchParamName?: string;           // varsayılan: "search"

  // Sıralama param adları (remote)
  sortParamName?: string;             // varsayılan: "sort"
  sortDirectionParamName?: string;    // varsayılan: "direction"

  // Sayfalama
  pageParamName?: string;             // varsayılan: "page"
  perPageParamName?: string;          // varsayılan: "per_page"
  pageSize?: number;                  // varsayılan: 10
  pageSizes?: number[];               // varsayılan: [10, 25, 50, 100]

  // Seçim
  selectable?: boolean;
  selectedRows?: T[];                 // controlled seçim
  onSelectionChange?: (rows: T[]) => void;
  rowKey?: keyof T | ((row: T) => string); // satır anahtarı (benzersiz ID)

  // Görünüm
  striped?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;                 // stickyHeader ile birlikte kullan
  showColumnToggle?: boolean;         // sütun göster/gizle menüsü
  showColumnFilters?: boolean;        // sütun başlığı altında filtre satırı
  showFooter?: boolean;
  footerContent?: (columns, data) => React.ReactNode;

  // Callback'ler
  onRowClick?: (row: T, index: number) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onDataLoad?: (data: T[], meta: Record<string, unknown>) => void;
  onError?: (error: Error) => void;
  loading?: boolean;                  // dışarıdan yükleme durumu

  emptyMessage?: string;
  "aria-label"?: string;
  className?: string;
}
```

---

## Temel Kullanım (Local)

```tsx
import { DataTable } from "eglador-ui-react"

type User = { id: number; name: string; email: string; role: string }

const users: User[] = [
  { id: 1, name: "Ali Yıldız",   email: "ali@example.com",   role: "Admin" },
  { id: 2, name: "Ayşe Kaya",   email: "ayse@example.com",  role: "User" },
  { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", role: "User" },
]

const columns: DataTableColumn<User>[] = [
  { id: "name",  header: "Ad Soyad", accessorKey: "name",  sortable: true },
  { id: "email", header: "E-posta",  accessorKey: "email", sortable: true },
  { id: "role",  header: "Rol",      accessorKey: "role",  sortable: false },
]

<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  searchable
  size="sm"
/>
```

---

## Otomatik Sütun Üretimi

`columns` prop verilmezse data'nın ilk satırındaki alanlardan otomatik sütunlar üretilir.

```tsx
// columns prop'u yok — alanlar otomatik sütun olur
<DataTable data={users} rowKey="id" searchable />

// Belirli alanları göster
<DataTable data={users} includeColumns={["name", "email"]} />

// Belirli alanları gizle
<DataTable data={users} excludeColumns={["id", "password"]} />
```

---

## Custom Cell Render

```tsx
const columns: DataTableColumn<User>[] = [
  {
    id: "name",
    header: "Ad",
    accessorKey: "name",
    cell: (value, row) => (
      <div className="flex items-center gap-2">
        <Avatar size="xs">{String(value)[0]}</Avatar>
        <span>{String(value)}</span>
      </div>
    ),
  },
  {
    id: "role",
    header: "Rol",
    accessorKey: "role",
    cell: (value) => (
      <Badge color={value === "Admin" ? "primary" : "default"}>{String(value)}</Badge>
    ),
    sortable: false,
  },
  {
    id: "actions",
    header: "",
    cell: (_, row) => (
      <Button size="xs" variant="ghost" onClick={() => handleEdit(row)}>Düzenle</Button>
    ),
    sortable: false,
    filterable: false,
    hideable: false,
  },
]
```

---

## Remote API Modu

```tsx
// Gönderilen query param'lar:
// ?page=1&per_page=10&search=ali&sort=name&direction=asc

<DataTable<User>
  endpoint="/api/users"
  columns={columns}
  rowKey="id"
  searchable
  paginationMapping={{
    currentPage: "meta.current_page",
    lastPage:    "meta.last_page",
    perPage:     "meta.per_page",
    total:       "meta.total",
    from:        "meta.from",
    to:          "meta.to",
  }}
  responseMapping={{ data: "data" }}
/>

// Beklenen API yanıt yapısı:
// {
//   data: User[],
//   meta: { current_page, last_page, per_page, total, from, to }
// }
```

---

## Remote — Ekstra Sütun & Param

```tsx
// API sütunlarına aksiyon sütunu ekle
const actionColumn: DataTableColumn<User> = {
  id: "actions",
  header: "",
  cell: (_, row) => <Button size="xs">Düzenle</Button>,
  sortable: false,
  filterable: false,
}

<DataTable<User>
  endpoint="/api/users"
  addColumns={[actionColumn]}
  queryParams={{ status: "active" }}     // her isteğe eklenir
  headers={{ Authorization: "Bearer token" }}
/>
```

---

## Seçim

```tsx
// Uncontrolled
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  selectable
  onSelectionChange={(rows) => console.log(rows)}
/>

// Controlled
const [selected, setSelected] = useState<User[]>([])

<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  selectable
  selectedRows={selected}
  onSelectionChange={setSelected}
/>
```

---

## Sütun Filtreleri

`showColumnFilters` ile her sütun altına filtre girişi eklenir.

```tsx
const columns: DataTableColumn<User>[] = [
  { id: "name",  header: "Ad",  accessorKey: "name",  filterType: "text"   },
  { id: "role",  header: "Rol", accessorKey: "role",  filterType: "select" }, // select: unique değerler otomatik
  { id: "age",   header: "Yaş", accessorKey: "age",   filterType: "number" }, // min/max range
  { id: "date",  header: "Tarih", accessorKey: "date", filterType: "date"  }, // tarih aralığı
  { id: "email", header: "E-posta", accessorKey: "email", filterable: false }, // filtre yok
]

<DataTable
  data={users}
  columns={columns}
  showColumnFilters
/>
```

---

## Sticky Header & Sabit Sütunlar

```tsx
// Sticky header
<DataTable
  data={users}
  columns={columns}
  stickyHeader
  maxHeight="400px"     // stickyHeader için maxHeight zorunlu
/>

// Sabit (sticky) sütunlar
const columns: DataTableColumn<User>[] = [
  { id: "name",    header: "Ad",      accessorKey: "name",    fixed: "left" },
  { id: "email",   header: "E-posta", accessorKey: "email"                  },
  { id: "actions", header: "",        cell: ...,              fixed: "right" },
]
```

---

## Görünüm Seçenekleri

```tsx
<DataTable
  data={users}
  columns={columns}
  striped              // çift satır arka plan
  bordered             // dış kenarlık
  showColumnToggle     // sütun göster/gizle menüsü
  size="xs"            // "xs" | "sm" | "md"
/>
```

---

## Footer

```tsx
// Varsayılan footer (sütun başlıklarını tekrar gösterir)
<DataTable data={users} columns={columns} showFooter />

// Özel footer — toplam satır gibi özet hesaplamalar için
<DataTable
  data={users}
  columns={columns}
  showFooter
  footerContent={(cols, rows) => (
    <tr>
      <td colSpan={cols.length} className="px-4 py-2 text-sm font-semibold text-zinc-700">
        Toplam: {rows.length} satır
      </td>
    </tr>
  )}
/>
```

---

## Sık Yapılan Hatalar

```tsx
// ❌ Yanlış — DataTable alt bileşen API'si yok
<DataTable>
  <DataTable.Column />
  <DataTable.Row />
</DataTable>

// ❌ Yanlış — stickyHeader'ı maxHeight olmadan kullanma
<DataTable stickyHeader />   // maxHeight de ver

// ❌ Yanlış — remote modda paginationMapping vermeden sunucu sayfalamayı beklemek
// paginationMapping yoksa sadece client-side sayfalama çalışır

// ✅ Doğru — sütun id'si accessorKey ile eşleşmek zorunda değil
{ id: "userRole", header: "Rol", accessorKey: "role" }
```
