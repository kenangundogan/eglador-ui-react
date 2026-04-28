import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SharpProcessOptions {
  format?: "webp" | "jpeg" | "png" | "avif";
  quality?: number;
  kernel?: "lanczos3" | "lanczos2" | "nearest" | "cubic" | "mitchell";
  withoutEnlargement?: boolean;
}

export interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  /** Bytes */
  size: number;
}

export interface SaveOptions {
  outputDir: string;
  fileName?: string;
  /** URL prefix for the saved file. Default: "/uploads" */
  baseUrl?: string;
}

export interface SavedImage extends ProcessedImage {
  filePath: string;
  url: string;
  fileName: string;
}

// ── Core ──────────────────────────────────────────────────────────────────────

/**
 * ImageCropper'dan gelen blob'u Sharp ile yeniden işler.
 * Tarayıcı canvas çıktısını Lanczos3 yeniden örnekleme + hedef format ile kalitelendirir.
 */
export async function processImageBuffer(
  input: Buffer,
  targetWidth: number,
  targetHeight: number,
  options: SharpProcessOptions = {},
): Promise<ProcessedImage> {
  const {
    format = "webp",
    quality = 85,
    kernel = "lanczos3",
    withoutEnlargement = true,
  } = options;

  const pipeline = sharp(input).resize(targetWidth, targetHeight, {
    fit: "cover",
    position: "centre",
    kernel: sharp.kernel[kernel],
    withoutEnlargement,
  });

  let buffer: Buffer;

  switch (format) {
    case "webp":
      buffer = await pipeline.webp({ quality }).toBuffer();
      break;
    case "jpeg":
      buffer = await pipeline.jpeg({ quality, progressive: true, mozjpeg: true }).toBuffer();
      break;
    case "png":
      buffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
      break;
    case "avif":
      buffer = await pipeline.avif({ quality }).toBuffer();
      break;
    default:
      buffer = await pipeline.webp({ quality }).toBuffer();
  }

  const meta = await sharp(buffer).metadata();

  return {
    buffer,
    format,
    width: meta.width ?? targetWidth,
    height: meta.height ?? targetHeight,
    size: buffer.length,
  };
}

/**
 * ProcessedImage'ı diske kaydeder ve URL döner.
 */
export async function saveProcessedImage(
  processed: ProcessedImage,
  options: SaveOptions,
): Promise<SavedImage> {
  const {
    outputDir,
    baseUrl = "/uploads",
    fileName = `${Date.now()}_${processed.width}x${processed.height}.${processed.format}`,
  } = options;

  const filePath = path.join(outputDir, fileName);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, processed.buffer);

  return {
    ...processed,
    filePath,
    fileName,
    url: `${baseUrl}/${fileName}`,
  };
}
