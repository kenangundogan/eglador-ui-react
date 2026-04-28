/**
 * Express / Node.js entegrasyonu.
 *
 * Bağımlılık: multer (memoryStorage)
 *   npm install multer
 *   npm install -D @types/multer
 *
 * Kullanım:
 *   import multer from "multer"
 *   import { createExpressCropHandler } from "./image-processing/express"
 *
 *   const upload = multer({ storage: multer.memoryStorage() })
 *   router.post("/api/images/crop", upload.single("file"), createExpressCropHandler({ format: "webp" }))
 */

import path from "path";
import type { Request, Response } from "express";
import { processImageBuffer, saveProcessedImage } from "./index";
import type { SharpProcessOptions, SavedImage } from "./index";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExpressCropHandlerOptions extends SharpProcessOptions {
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

// ── Multer genişletilmiş Request tipi ─────────────────────────────────────────

interface MulterRequest extends Request {
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
}

// ── Handler Factory ───────────────────────────────────────────────────────────

export function createExpressCropHandler(options: ExpressCropHandlerOptions = {}) {
  const {
    outputDir = path.join(process.cwd(), "public", "uploads"),
    baseUrl = "/uploads",
    onSave,
    ...sharpOptions
  } = options;

  return async function handler(req: MulterRequest, res: Response): Promise<void> {
    try {
      const buffer = req.file?.buffer;
      const width  = Number(req.body.width);
      const height = Number(req.body.height);
      const sizeId = (req.body.sizeId as string | undefined) ?? undefined;

      if (!buffer || !width || !height) {
        res.status(400).json({ error: "Eksik parametre: file, width ve height zorunlu" });
        return;
      }

      const processed = await processImageBuffer(buffer, width, height, sharpOptions);

      const suffix   = sizeId ? `_${sizeId}` : "_custom";
      const fileName = `${Date.now()}${suffix}.${processed.format}`;

      const saved = await saveProcessedImage(processed, { outputDir, baseUrl, fileName });

      await onSave?.(saved);

      res.json({
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
      res.status(500).json({ error: message });
    }
  };
}
