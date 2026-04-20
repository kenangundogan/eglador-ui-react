import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCropper, type AutoCropSize, type CropResult } from "./image-cropper";
import { FileManager, type FileManagerItem } from "../file-manager/file-manager";

// ── Sample images ─────────────────────────────

const LANDSCAPE_IMG = "https://picsum.photos/seed/landscape/1200/800";
const PORTRAIT_IMG  = "https://picsum.photos/seed/portrait/800/1200";
const SQUARE_IMG    = "https://picsum.photos/seed/square/900/900";
const WIDE_IMG      = "https://picsum.photos/seed/wide/1600/600";

// ── Meta ─────────────────────────────────────

const meta: Meta<typeof ImageCropper> = {
  title: "Components/ImageCropper",
  component: ImageCropper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Canvas tabanlı görsel kırpma aracı. Otomatik boyut kesimi (merkez kadraj) ve interaktif özel kesim destekler. Sonuçları `uploadEndpoint`'e POST eder veya `onSave` callback'i ile döner.",
      },
    },
  },
  argTypes: {
    src:            { control: "text" },
    fileName:       { control: "text" },
    uploadEndpoint: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ImageCropper>;

// ── Default (Otomatik Kesim) ──────────────────

export const Default: Story = {
  render: () => (
    <ImageCropper
      src={LANDSCAPE_IMG}
      fileName="landscape.jpg"
      className="w-full max-w-5xl mx-auto"
    />
  ),
};

// ── Özel Kesim ───────────────────────────────

export const CustomCrop: Story = {
  parameters: {
    docs: {
      description: { story: "Özel kesim sekmesi açık başlar. Mouse ile kırpma alanını sürükle ve yeniden boyutlandır." },
    },
  },
  render: () => {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <ImageCropperCustomTab src={LANDSCAPE_IMG} />
      </div>
    );
  },
};

function ImageCropperCustomTab({ src }: { src: string }) {
  return (
    <div>
      <ImageCropper
        src={src}
        fileName="photo.jpg"
        className="w-full"
      />
      <p className="mt-2 text-xs text-zinc-400 text-center">
        "Özel Kesim" sekmesine geçerek interaktif kırpma aracını dene
      </p>
    </div>
  );
}

// ── Dikey (Portrait) Görsel ──────────────────

export const PortraitImage: Story = {
  parameters: {
    docs: {
      description: { story: "Dikey görsellerde otomatik kesim en-boy oranını koruyarak merkezi kadrajlar." },
    },
  },
  render: () => (
    <ImageCropper
      src={PORTRAIT_IMG}
      fileName="portrait.jpg"
      className="w-full max-w-5xl mx-auto"
    />
  ),
};

// ── Geniş (Panoramik) Görsel ─────────────────

export const WideImage: Story = {
  parameters: {
    docs: {
      description: { story: "Çok geniş panoramik görseller için otomatik kırpma." },
    },
  },
  render: () => (
    <ImageCropper
      src={WIDE_IMG}
      fileName="panorama.jpg"
      className="w-full max-w-5xl mx-auto"
    />
  ),
};

// ── Özel Boyutlar ─────────────────────────────

export const CustomSizes: Story = {
  parameters: {
    docs: {
      description: { story: "E-ticaret için özelleştirilmiş ürün görseli boyutları." },
    },
  },
  render: () => {
    const ecommerceSizes: AutoCropSize[] = [
      { id: "product-main",  name: "Ürün Ana Görsel",  width: 800,  height: 800,  enabled: true  },
      { id: "product-thumb", name: "Ürün Thumbnail",   width: 200,  height: 200,  enabled: true  },
      { id: "banner",        name: "Kategori Banner",  width: 1200, height: 400,  enabled: false },
      { id: "og-image",      name: "OG / Social",      width: 1200, height: 630,  enabled: false },
      { id: "mobile",        name: "Mobil Banner",     width: 750,  height: 400,  enabled: false },
    ];

    return (
      <ImageCropper
        src={SQUARE_IMG}
        fileName="product.jpg"
        autoCropSizes={ecommerceSizes}
        className="w-full max-w-5xl mx-auto"
      />
    );
  },
};

// ── onSave Callback ───────────────────────────

export const WithSaveCallback: Story = {
  parameters: {
    docs: {
      description: { story: "`onSave` callback'i ile kırpma sonuçlarını yakala. Sonuçlar ekranda listelenir." },
    },
  },
  render: () => {
    const [saved, setSaved] = useState<CropResult[]>([]);

    return (
      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        <ImageCropper
          src={LANDSCAPE_IMG}
          fileName="photo.jpg"
          onSave={(results) => setSaved(results)}
          className="w-full"
        />

        {saved.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold text-zinc-700 mb-3">
              onSave callback — {saved.length} sonuç:
            </p>
            <div className="space-y-1.5">
              {saved.map((r) => (
                <div key={r.id} className="flex items-center gap-3 text-xs bg-white rounded border border-zinc-200 px-3 py-2">
                  <img src={r.dataUrl} alt={r.name} className="size-8 rounded object-cover border border-zinc-200" />
                  <span className="font-medium text-zinc-800">{r.name}</span>
                  <span className="text-zinc-400">{r.width} × {r.height} px</span>
                  <span className="text-zinc-400 truncate">{r.fileName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

// ── Upload Endpoint ───────────────────────────

export const WithUploadEndpoint: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Kırpılan görseller `uploadEndpoint`'e `FormData` olarak POST edilir. `file`, `width`, `height`, `sizeId` alanları gönderilir. Bu örnekte endpoint gerçek değildir — network sekmesinden isteği görebilirsin.",
      },
    },
  },
  render: () => (
    <ImageCropper
      src={LANDSCAPE_IMG}
      fileName="upload-test.jpg"
      uploadEndpoint="/api/images/crop"
      uploadHeaders={{ "X-App-Token": "demo-token" }}
      onSave={(results) => console.log("Yükleme tamamlandı:", results)}
      className="w-full max-w-5xl mx-auto"
    />
  ),
};

// ── Kapatma Butonu ────────────────────────────

export const WithCloseButton: Story = {
  parameters: {
    docs: {
      description: { story: "`onClose` prop verildiğinde sağ üstte X butonu görünür. Modal senaryoları için kullanışlıdır." },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div className="max-w-5xl mx-auto">
        {open ? (
          <ImageCropper
            src={LANDSCAPE_IMG}
            fileName="photo.jpg"
            onClose={() => setOpen(false)}
            className="w-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-zinc-400">
            <p className="text-sm">Kapatıldı.</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-xs text-blue-600 hover:underline"
            >
              Tekrar aç
            </button>
          </div>
        )}
      </div>
    );
  },
};

// ── Modal Entegrasyon ─────────────────────────

export const ModalIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: "Gerçek dünya kullanımı: ImageCropper bir modal overlay içinde gösterilir.",
      },
    },
  },
  render: () => {
    const [activeSrc, setActiveSrc] = useState<string | null>(null);
    const [results, setResults] = useState<CropResult[]>([]);

    const images = [
      { src: LANDSCAPE_IMG, label: "Landscape" },
      { src: PORTRAIT_IMG,  label: "Portrait" },
      { src: SQUARE_IMG,    label: "Square" },
      { src: WIDE_IMG,      label: "Wide" },
    ];

    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveSrc(img.src)}
              className="group relative aspect-video rounded-lg overflow-hidden border border-zinc-200 hover:border-blue-400 transition-colors"
            >
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Kırp
                </span>
              </div>
              <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white rounded px-1.5 py-0.5">
                {img.label}
              </span>
            </button>
          ))}
        </div>

        {results.length > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-semibold text-green-700 mb-2">Son işlenen görseller:</p>
            <div className="flex gap-3 flex-wrap">
              {results.map((r) => (
                <div key={`${r.id}-${r.width}`} className="text-center">
                  <img src={r.dataUrl} alt={r.name} className="size-12 object-cover rounded border border-green-200" />
                  <div className="text-[10px] text-green-700 mt-1">{r.width}×{r.height}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <ImageCropper
              src={activeSrc}
              fileName="modal-image.jpg"
              onSave={(res) => { setResults(res); setActiveSrc(null); }}
              onClose={() => setActiveSrc(null)}
              className="w-full max-w-5xl max-h-[90vh] overflow-auto"
            />
          </div>
        )}
      </div>
    );
  },
};

// ── FileManager + ImageCropper Entegrasyon ────

const fileManagerItems: FileManagerItem[] = [
  { id: "f1", name: "Görseller", type: "folder", modifiedAt: "2026-04-10" },
  {
    id: "i1", name: "hero-banner.jpg", type: "file", parentId: "f1",
    mimeType: "image/jpeg", size: 2800000, modifiedAt: "2026-04-15",
    thumbnailUrl: LANDSCAPE_IMG,
  },
  {
    id: "i2", name: "profil-foto.jpg", type: "file", parentId: "f1",
    mimeType: "image/jpeg", size: 980000, modifiedAt: "2026-04-14",
    thumbnailUrl: PORTRAIT_IMG,
  },
  {
    id: "i3", name: "kare-gorsel.png", type: "file", parentId: "f1",
    mimeType: "image/png", size: 1400000, modifiedAt: "2026-04-13",
    thumbnailUrl: SQUARE_IMG,
  },
  {
    id: "i4", name: "panorama.jpg", type: "file", parentId: "f1",
    mimeType: "image/jpeg", size: 3200000, modifiedAt: "2026-04-12",
    thumbnailUrl: WIDE_IMG,
  },
  { id: "d1", name: "rapor.pdf",  type: "file", parentId: "f1", mimeType: "application/pdf", size: 540000, modifiedAt: "2026-04-11" },
];

export const WithFileManager: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "FileManager ile tam entegrasyon. Bir görsel seçin, sağ paneldeki **Görseli Kırp** butonuna tıklayın.",
      },
    },
  },
  render: () => {
    const [cropItem, setCropItem] = useState<FileManagerItem | null>(null);
    const [savedResults, setSavedResults] = useState<CropResult[]>([]);

    return (
      <div className="space-y-4">
        <div className="h-[480px]">
          <FileManager
            items={fileManagerItems}
            defaultFolderId="f1"
            showPreview
            showSidebar
            onCropImage={(item) => setCropItem(item)}
            onFileOpen={(item) => alert(`Açıldı: ${item.name}`)}
          />
        </div>

        {savedResults.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold text-zinc-700 mb-2">
              Son kırpılan görseller ({savedResults.length} adet):
            </p>
            <div className="flex gap-3 flex-wrap">
              {savedResults.map((r) => (
                <div key={`${r.id}-${r.fileName}`} className="text-center">
                  <img src={r.dataUrl} alt={r.name} className="size-14 object-cover rounded border border-zinc-200" />
                  <div className="text-[10px] text-zinc-500 mt-1">{r.name}</div>
                  <div className="text-[10px] text-zinc-400">{r.width}×{r.height}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cropItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <ImageCropper
              src={cropItem.thumbnailUrl!}
              fileName={cropItem.name}
              onSave={(results) => {
                setSavedResults(results);
                setCropItem(null);
              }}
              onClose={() => setCropItem(null)}
              className="w-full max-w-5xl"
            />
          </div>
        )}
      </div>
    );
  },
};

// ── Sharp Sunucu Entegrasyonu (Referans) ──────

export const SharpServerIntegration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Sharp ile Sunucu Taraflı Kesim

Tarayıcı Canvas API yerine sunucuda **Sharp** kullanmak daha yüksek kalite sağlar.
ImageCropper, \`uploadEndpoint\` prop'una kırpılan blob'u FormData ile POST eder.
Sunucu bu blob'u Sharp ile yeniden işleyerek kaydedebilir.

---

### Kurulum

\`\`\`bash
npm install sharp
# veya
yarn add sharp
# veya
pnpm add sharp
\`\`\`

TypeScript kullanıyorsan tip tanımlarını da ekle:

\`\`\`bash
npm install -D @types/sharp
\`\`\`

---

### Next.js App Router — API Route

\`\`\`ts
// app/api/images/crop/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const file     = form.get("file") as File;
  const width    = Number(form.get("width")  ?? 0);
  const height   = Number(form.get("height") ?? 0);
  const sizeId   = form.get("sizeId") as string | null;  // otomatik kesimde gelir

  if (!file || !width || !height) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const processed = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,   // en yüksek kalite
    })
    .webp({ quality: 85 })             // veya .jpeg({ quality: 90 })
    .toBuffer();

  // Dosyayı kaydet (public/uploads/ klasörü örneği)
  const fileName = sizeId
    ? \`\${Date.now()}_\${sizeId}.webp\`
    : \`\${Date.now()}_custom.webp\`;

  const savePath = path.join(process.cwd(), "public", "uploads", fileName);
  await fs.mkdir(path.dirname(savePath), { recursive: true });
  await fs.writeFile(savePath, processed);

  return NextResponse.json({
    url: \`/uploads/\${fileName}\`,
    width,
    height,
    sizeId,
  });
}
\`\`\`

---

### Express / Node.js API Route

\`\`\`ts
// routes/crop.ts
import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/api/images/crop", upload.single("file"), async (req, res) => {
  const buffer = req.file?.buffer;
  const width  = Number(req.body.width);
  const height = Number(req.body.height);
  const sizeId = req.body.sizeId as string | undefined;

  if (!buffer || !width || !height) {
    return res.status(400).json({ error: "Eksik parametre" });
  }

  const processed = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 85 })
    .toBuffer();

  const fileName = sizeId
    ? \`\${Date.now()}_\${sizeId}.webp\`
    : \`\${Date.now()}_custom.webp\`;

  const savePath = path.join(__dirname, "../public/uploads", fileName);
  await fs.mkdir(path.dirname(savePath), { recursive: true });
  await fs.writeFile(savePath, processed);

  res.json({ url: \`/uploads/\${fileName}\`, width, height });
});

export default router;
\`\`\`

---

### Component Kullanımı

\`\`\`tsx
<ImageCropper
  src="/images/orjinal.jpg"
  fileName="urun-gorseli.jpg"
  uploadEndpoint="/api/images/crop"
  uploadHeaders={{
    Authorization: "Bearer <token>",  // isteğe bağlı
  }}
  autoCropSizes={[
    { id: "full-hd",   name: "Full HD",  width: 1920, height: 1080, enabled: true  },
    { id: "thumbnail", name: "Thumb",    width: 400,  height: 300,  enabled: true  },
    { id: "avatar",    name: "Avatar",   width: 200,  height: 200,  enabled: false },
  ]}
  onSave={(results) => {
    // results[].blob    → kırpılmış Blob (tarayıcı canvas çıktısı)
    // results[].dataUrl → önizleme URL
    // Sunucu yanıtını ayrıca fetch ile okumak istersen onSave yerine
    // uploadEndpoint response'unu işleyebilirsin.
    console.log("Tamamlandı:", results);
  }}
  onClose={() => setOpen(false)}
/>
\`\`\`

---

### FormData Şeması (Sunucuya Gönderilen)

| Alan | Tip | Açıklama |
|---|---|---|
| \`file\` | \`Blob\` | Kırpılmış görsel (canvas çıktısı) |
| \`width\` | \`string\` | Hedef genişlik (px) |
| \`height\` | \`string\` | Hedef yükseklik (px) |
| \`sizeId\` | \`string?\` | Otomatik kesim boyut ID'si |

---

### Sharp Resize Seçenekleri

\`\`\`ts
sharp(buffer).resize(width, height, {
  fit: "cover",        // cover | contain | fill | inside | outside
  position: "centre",  // centre | top | right | bottom | left | attention | entropy
  kernel: sharp.kernel.lanczos3,  // en kaliteli yeniden örnekleme
  withoutEnlargement: true,       // orijinalden büyütme
})
\`\`\`
        `,
      },
    },
  },
  render: () => (
    <div className="max-w-3xl mx-auto space-y-4 p-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-800 mb-1">Bu story bir referans dökümandır</p>
        <p className="text-xs text-blue-700">
          Docs sekmesinden Sharp kurulum adımlarını ve sunucu endpoint örneklerini görebilirsin.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
        <p className="text-xs font-semibold text-zinc-700">Akış özeti</p>
        <div className="flex items-start gap-3">
          {[
            { step: "1", title: "Tarayıcı", desc: "Canvas API ile kırpar, blob oluşturur" },
            { step: "2", title: "FormData POST", desc: "file + width + height + sizeId gönderir" },
            { step: "3", title: "Sunucu (Sharp)", desc: "Lanczos3 ile yeniden örnekler, WebP kaydeder" },
          ].map((s) => (
            <div key={s.step} className="flex-1 rounded-lg bg-white border border-zinc-200 p-3 text-center">
              <div className="size-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <div className="text-xs font-semibold text-zinc-800">{s.title}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <ImageCropper
        src={LANDSCAPE_IMG}
        fileName="ornek.jpg"
        uploadEndpoint="/api/images/crop"
        className="w-full"
      />
    </div>
  ),
};
