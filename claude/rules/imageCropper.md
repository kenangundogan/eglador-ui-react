# ImageCropper Bileşeni

Canvas tabanlı görsel kırpma aracı. Otomatik boyut kesimi ve interaktif özel kesim destekler.

## Import

```tsx
import { ImageCropper } from "../../components/image-cropper"
// veya paket dışından direkt kullanım — dosya konumu: src/components/image-cropper/image-cropper.tsx
```

---

## Tipler

```typescript
interface AutoCropSize {
  id: string;
  name: string;
  width: number;
  height: number;
  enabled: boolean;
}

interface CropArea {
  x: number;       // % cinsinden
  y: number;
  width: number;
  height: number;
}

interface CropResult {
  id: string;
  name: string;
  width: number;
  height: number;
  blob: Blob;
  dataUrl: string;
  fileName: string;
}

type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "3:2" | "2:3" | "9:16" | "custom";
```

---

## Props

```typescript
interface ImageCropperProps {
  src: string;                              // zorunlu — görsel URL
  fileName?: string;                        // varsayılan: "image"
  autoCropSizes?: AutoCropSize[];           // varsayılan: Full HD, HD, Kare, Thumbnail, Avatar
  uploadEndpoint?: string;                  // POST endpoint — yoksa sadece onSave çağrılır
  uploadHeaders?: Record<string, string>;   // endpoint için ek header'lar
  onSave?: (results: CropResult[]) => void; // kırpma tamamlandığında
  onClose?: () => void;                     // verilirse sağ üstte X butonu görünür
  className?: string;
}
```

---

## Temel Kullanım

```tsx
<ImageCropper
  src="/images/photo.jpg"
  fileName="photo.jpg"
  className="w-full max-w-5xl mx-auto"
/>
```

---

## onSave Callback

```tsx
<ImageCropper
  src="/images/photo.jpg"
  fileName="photo.jpg"
  onSave={(results) => {
    // results[].blob    → kırpılmış Blob (canvas çıktısı)
    // results[].dataUrl → önizleme URL (URL.createObjectURL)
    // results[].fileName → "photo_full-hd.jpg" formatında
    console.log(results);
  }}
/>
```

---

## Özel Boyutlar

```tsx
const sizes: AutoCropSize[] = [
  { id: "product-main",  name: "Ürün Ana",   width: 800,  height: 800,  enabled: true  },
  { id: "product-thumb", name: "Thumbnail",  width: 200,  height: 200,  enabled: true  },
  { id: "banner",        name: "Banner",     width: 1200, height: 400,  enabled: false },
]

<ImageCropper
  src="/images/product.jpg"
  autoCropSizes={sizes}
  onSave={handleSave}
/>
```

---

## Upload Endpoint

Kırpılan görseller `uploadEndpoint`'e `FormData` olarak POST edilir.

**Gönderilen alanlar:**

| Alan | Tip | Açıklama |
|------|-----|----------|
| `file` | `Blob` | Kırpılmış görsel (canvas çıktısı) |
| `width` | `string` | Hedef genişlik (px) |
| `height` | `string` | Hedef yükseklik (px) |
| `sizeId` | `string?` | Otomatik kesimde boyut ID'si |

```tsx
<ImageCropper
  src="/images/photo.jpg"
  uploadEndpoint="/api/images/crop"
  uploadHeaders={{ Authorization: "Bearer <token>" }}
  onSave={(results) => console.log("Tamamlandı:", results)}
/>
```

---

## Modal Entegrasyon

```tsx
const [open, setOpen] = useState(false)
const [src, setSrc] = useState("")

{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <ImageCropper
      src={src}
      fileName="photo.jpg"
      onSave={(results) => { handleSave(results); setOpen(false); }}
      onClose={() => setOpen(false)}
      className="w-full max-w-5xl max-h-[90vh] overflow-auto"
    />
  </div>
)}
```

---

## Sekmeler

Bileşen iki sekme içerir:

- **Otomatik Kesim** — `autoCropSizes` listesindeki boyutları merkez kadrajla üretir. Boyutlar checkbox ile açılıp kapatılabilir, yeni boyut eklenebilir.
- **Özel Kesim** — Kullanıcı mouse ile kırpma alanını sürükleyip yeniden boyutlandırır. En-boy oranı sabitleme ve `custom` oran desteği vardır.

---

## Varsayılan Boyutlar

| id | name | boyut |
|----|------|-------|
| `full-hd` | Full HD | 1920×1080 (enabled) |
| `hd` | HD | 1280×720 (enabled) |
| `square` | Kare | 1080×1080 (disabled) |
| `thumbnail` | Thumbnail | 400×300 (disabled) |
| `avatar` | Avatar | 200×200 (disabled) |

---

## Sharp ile Sunucu Taraflı Kesim (Next.js)

```ts
// app/api/images/crop/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file   = form.get("file") as File;
  const width  = Number(form.get("width")  ?? 0);
  const height = Number(form.get("height") ?? 0);
  const sizeId = form.get("sizeId") as string | null;

  if (!file || !width || !height) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const processed = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 85 })
    .toBuffer();

  const fileName = sizeId
    ? `${Date.now()}_${sizeId}.webp`
    : `${Date.now()}_custom.webp`;

  const savePath = path.join(process.cwd(), "public", "uploads", fileName);
  await fs.mkdir(path.dirname(savePath), { recursive: true });
  await fs.writeFile(savePath, processed);

  return NextResponse.json({ url: `/uploads/${fileName}`, width, height, sizeId });
}
```

---

## FileManager Entegrasyonu

```tsx
import { FileManager } from "eglador-ui-react"
import { ImageCropper } from "../../components/image-cropper"

const [cropItem, setCropItem] = useState<FileManagerItem | null>(null)

<FileManager
  items={items}
  showPreview
  showSidebar
  onCropImage={(item) => setCropItem(item)}
/>

{cropItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <ImageCropper
      src={cropItem.thumbnailUrl!}
      fileName={cropItem.name}
      onSave={(results) => { handleSave(results); setCropItem(null); }}
      onClose={() => setCropItem(null)}
      className="w-full max-w-5xl"
    />
  </div>
)}
```
