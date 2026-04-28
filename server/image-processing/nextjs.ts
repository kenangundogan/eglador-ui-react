/**
 * Next.js App Router entegrasyonu.
 *
 * Kullanım:
 *   // app/api/images/crop/route.ts
 *   import { createNextCropHandler } from "@/server/image-processing/nextjs"
 *   export const POST = createNextCropHandler({ format: "webp", quality: 85 })
 */

import path from "path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { processImageBuffer, saveProcessedImage } from "./index";
import type { SharpProcessOptions, SavedImage } from "./index";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NextCropHandlerOptions extends SharpProcessOptions {
  /**
   * Görsellerin kaydedileceği dizin.
   * Default: <cwd>/public/uploads
   */
  outputDir?: string;
  /**
   * Dönen URL prefix.
   * Default: /uploads
   */
  baseUrl?: string;
  /**
   * Kayıt sonrası çalışan hook — cloud storage, DB kaydı vb. için.
   */
  onSave?: (result: SavedImage) => Promise<void> | void;
}

// ── Handler Factory ───────────────────────────────────────────────────────────

export function createNextCropHandler(options: NextCropHandlerOptions = {}) {
  const {
    outputDir = path.join(process.cwd(), "public", "uploads"),
    baseUrl = "/uploads",
    onSave,
    ...sharpOptions
  } = options;

  return async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      const form = await req.formData();

      const file   = form.get("file") as File | null;
      const width  = Number(form.get("width"));
      const height = Number(form.get("height"));
      const sizeId = (form.get("sizeId") as string | null) ?? undefined;

      if (!file || !width || !height) {
        return NextResponse.json(
          { error: "Eksik parametre: file, width ve height zorunlu" },
          { status: 400 },
        );
      }

      const buffer    = Buffer.from(await file.arrayBuffer());
      const processed = await processImageBuffer(buffer, width, height, sharpOptions);

      const suffix   = sizeId ? `_${sizeId}` : "_custom";
      const fileName = `${Date.now()}${suffix}.${processed.format}`;

      const saved = await saveProcessedImage(processed, { outputDir, baseUrl, fileName });

      await onSave?.(saved);

      return NextResponse.json({
        url:      saved.url,
        fileName: saved.fileName,
        width:    saved.width,
        height:   saved.height,
        size:     saved.size,
        sizeId:   sizeId ?? null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sunucu hatası";
      console.error("[image-processing]", err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
