"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AutoCropSize {
  id: string;
  name: string;
  width: number;
  height: number;
  enabled: boolean;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  id: string;
  name: string;
  width: number;
  height: number;
  blob: Blob;
  dataUrl: string;
  fileName: string;
}

export type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "3:2" | "2:3" | "9:16" | "custom";

export interface ImageCropperProps {
  src: string;
  fileName?: string;
  autoCropSizes?: AutoCropSize[];
  uploadEndpoint?: string;
  uploadHeaders?: Record<string, string>;
  onSave?: (results: CropResult[]) => void;
  onClose?: () => void;
  className?: string;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SIZES: AutoCropSize[] = [
  { id: "full-hd",   name: "Full HD",   width: 1920, height: 1080, enabled: true  },
  { id: "hd",        name: "HD",        width: 1280, height: 720,  enabled: true  },
  { id: "square",    name: "Kare",      width: 1080, height: 1080, enabled: false },
  { id: "thumbnail", name: "Thumbnail", width: 400,  height: 300,  enabled: false },
  { id: "avatar",    name: "Avatar",    width: 200,  height: 200,  enabled: false },
];

const ASPECT_PRESETS: { label: string; value: AspectPreset; ratio: number | null }[] = [
  { label: "Serbest", value: "free",  ratio: null   },
  { label: "1:1",     value: "1:1",   ratio: 1      },
  { label: "4:3",     value: "4:3",   ratio: 4 / 3  },
  { label: "16:9",    value: "16:9",  ratio: 16 / 9 },
  { label: "3:2",     value: "3:2",   ratio: 3 / 2  },
  { label: "2:3",     value: "2:3",   ratio: 2 / 3  },
  { label: "9:16",    value: "9:16",  ratio: 9 / 16 },
];

// ── Utilities ─────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

async function cropToBlob(
  imgSrc: string,
  crop: CropArea,
  targetW: number,
  targetH: number,
  format: "jpeg" | "png" | "webp",
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      const sx = (crop.x / 100) * img.naturalWidth;
      const sy = (crop.y / 100) * img.naturalHeight;
      const sw = (crop.width / 100) * img.naturalWidth;
      const sh = (crop.height / 100) * img.naturalHeight;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas blob dönüşümü başarısız"))),
        `image/${format}`,
        quality,
      );
    };
    img.onerror = () => reject(new Error("Görsel yüklenemedi"));
    img.src = imgSrc;
  });
}

function centerCropForAspect(imgAspect: number, targetAspect: number): CropArea {
  if (imgAspect > targetAspect) {
    const w = (targetAspect / imgAspect) * 100;
    return { x: (100 - w) / 2, y: 0, width: w, height: 100 };
  }
  const h = (imgAspect / targetAspect) * 100;
  return { x: 0, y: (100 - h) / 2, width: 100, height: h };
}

// ── Handle types ──────────────────────────────────────────────────────────────

type HandleId = "tl" | "tc" | "tr" | "ml" | "mr" | "bl" | "bc" | "br" | "move";

interface DragState {
  handle: HandleId;
  startX: number;
  startY: number;
  startCrop: CropArea;
}

const HANDLE_CURSORS: Record<HandleId, string> = {
  tl: "nw-resize", tc: "n-resize",  tr: "ne-resize",
  ml: "w-resize",                    mr: "e-resize",
  bl: "sw-resize", bc: "s-resize",  br: "se-resize",
  move: "move",
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

// ── ImageCropper Component ────────────────────────────────────────────────────

export function ImageCropper({
  src,
  fileName = "image",
  autoCropSizes = DEFAULT_SIZES,
  uploadEndpoint,
  uploadHeaders = {},
  onSave,
  onClose,
  className,
}: ImageCropperProps) {
  const [tab, setTab] = React.useState<"auto" | "custom">("auto");
  const [cropArea, setCropArea] = React.useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
  const [aspectPreset, setAspectPreset] = React.useState<AspectPreset>("free");
  const [customAspect, setCustomAspect] = React.useState({ w: "16", h: "9" });
  const [sizes, setSizes] = React.useState<AutoCropSize[]>(autoCropSizes);
  const [quality, setQuality] = React.useState(85);
  const [format, setFormat] = React.useState<"jpeg" | "png" | "webp">("jpeg");
  const [processing, setProcessing] = React.useState(false);
  const [results, setResults] = React.useState<CropResult[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [naturalSize, setNaturalSize] = React.useState({ w: 1, h: 1 });
  const [newSize, setNewSize] = React.useState({ name: "", width: "", height: "" });
  const [showAdd, setShowAdd] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<DragState | null>(null);

  // Computed aspect ratio
  const aspectRatio = React.useMemo((): number | null => {
    if (aspectPreset === "free") return null;
    if (aspectPreset === "custom") {
      const w = parseFloat(customAspect.w);
      const h = parseFloat(customAspect.h);
      return w > 0 && h > 0 ? w / h : null;
    }
    return ASPECT_PRESETS.find((p) => p.value === aspectPreset)?.ratio ?? null;
  }, [aspectPreset, customAspect]);

  // Adjust crop when aspect ratio changes
  React.useEffect(() => {
    if (!aspectRatio) return;
    setCropArea((prev) => {
      const cx = prev.x + prev.width / 2;
      const cy = prev.y + prev.height / 2;
      let w = prev.width;
      let h = w / aspectRatio;
      if (cy - h / 2 < 0 || cy + h / 2 > 100) {
        h = Math.min(cy * 2, (100 - cy) * 2);
        w = h * aspectRatio;
      }
      if (cx - w / 2 < 0 || cx + w / 2 > 100) {
        w = Math.min(cx * 2, (100 - cx) * 2);
        h = w / aspectRatio;
      }
      const x = clamp(cx - w / 2, 0, 100 - w);
      const y = clamp(cy - h / 2, 0, 100 - h);
      return { x, y, width: clamp(w, 1, 100 - x), height: clamp(h, 1, 100 - y) };
    });
  }, [aspectRatio]);

  const relPos = React.useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const startDrag = React.useCallback(
    (e: React.MouseEvent, handle: HandleId) => {
      e.preventDefault();
      e.stopPropagation();
      const pos = relPos(e);
      drag.current = { handle, startX: pos.x, startY: pos.y, startCrop: { ...cropArea } };
    },
    [cropArea, relPos],
  );

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return;
      const pos = relPos(e);
      const dx = pos.x - drag.current.startX;
      const dy = pos.y - drag.current.startY;
      const sc = drag.current.startCrop;
      const h = drag.current.handle;
      let { x, y, width, height } = sc;

      if (h === "move") {
        x = clamp(sc.x + dx, 0, 100 - sc.width);
        y = clamp(sc.y + dy, 0, 100 - sc.height);
      } else {
        if (h === "tl" || h === "ml" || h === "bl") {
          const nx = clamp(sc.x + dx, 0, sc.x + sc.width - 1);
          width = sc.width - (nx - sc.x);
          x = nx;
        }
        if (h === "tr" || h === "mr" || h === "br") {
          width = clamp(sc.width + dx, 1, 100 - sc.x);
        }
        if (h === "tl" || h === "tc" || h === "tr") {
          const ny = clamp(sc.y + dy, 0, sc.y + sc.height - 1);
          height = sc.height - (ny - sc.y);
          y = ny;
        }
        if (h === "bl" || h === "bc" || h === "br") {
          height = clamp(sc.height + dy, 1, 100 - sc.y);
        }

        if (aspectRatio) {
          if (h === "tc" || h === "bc") {
            width = height * aspectRatio;
            if (x + width > 100) { width = 100 - x; height = width / aspectRatio; }
          } else {
            height = width / aspectRatio;
            if (y + height > 100) { height = 100 - y; width = height * aspectRatio; }
          }
        }
      }

      x = clamp(x, 0, 100);
      y = clamp(y, 0, 100);
      width = clamp(width, 1, 100 - x);
      height = clamp(height, 1, 100 - y);
      setCropArea({ x, y, width, height });
    };

    const onUp = () => { drag.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [aspectRatio, relPos]);

  // Upload helper
  const uploadBlob = React.useCallback(
    async (blob: Blob, name: string, extra?: Record<string, string>) => {
      if (!uploadEndpoint) return;
      const form = new FormData();
      form.append("file", blob, name);
      if (extra) Object.entries(extra).forEach(([k, v]) => form.append(k, v));
      const res = await fetch(uploadEndpoint, { method: "POST", headers: uploadHeaders, body: form });
      if (!res.ok) throw new Error(`Yükleme başarısız: ${res.statusText}`);
    },
    [uploadEndpoint, uploadHeaders],
  );

  const baseName = fileName.replace(/\.[^.]+$/, "");
  const ext = format === "jpeg" ? "jpg" : format;

  const runAutoProcess = React.useCallback(async () => {
    const enabled = sizes.filter((s) => s.enabled);
    if (!enabled.length) return;
    setProcessing(true);
    setError(null);
    const out: CropResult[] = [];
    try {
      const imgAspect = naturalSize.w / naturalSize.h;
      for (const s of enabled) {
        const crop = centerCropForAspect(imgAspect, s.width / s.height);
        const blob = await cropToBlob(src, crop, s.width, s.height, format, quality / 100);
        const dataUrl = URL.createObjectURL(blob);
        const result: CropResult = {
          id: s.id,
          name: s.name,
          width: s.width,
          height: s.height,
          blob,
          dataUrl,
          fileName: `${baseName}_${s.id}.${ext}`,
        };
        out.push(result);
        await uploadBlob(blob, result.fileName, {
          width: String(s.width),
          height: String(s.height),
          sizeId: s.id,
        });
      }
      setResults(out);
      onSave?.(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İşlem başarısız");
    } finally {
      setProcessing(false);
    }
  }, [sizes, src, format, quality, naturalSize, baseName, ext, uploadBlob, onSave]);

  const runCustomCrop = React.useCallback(async () => {
    const w = Math.round((cropArea.width / 100) * naturalSize.w);
    const h = Math.round((cropArea.height / 100) * naturalSize.h);
    setProcessing(true);
    setError(null);
    try {
      const blob = await cropToBlob(src, cropArea, w, h, format, quality / 100);
      const dataUrl = URL.createObjectURL(blob);
      const result: CropResult = {
        id: "custom",
        name: "Özel Kesim",
        width: w,
        height: h,
        blob,
        dataUrl,
        fileName: `${baseName}_custom.${ext}`,
      };
      await uploadBlob(blob, result.fileName, { width: String(w), height: String(h) });
      setResults([result]);
      onSave?.([result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İşlem başarısız");
    } finally {
      setProcessing(false);
    }
  }, [cropArea, src, format, quality, naturalSize, baseName, ext, uploadBlob, onSave]);

  const enabledCount = sizes.filter((s) => s.enabled).length;

  const overlays = {
    top:    { top: 0, left: 0, right: 0, height: `${cropArea.y}%` },
    bottom: { top: `${cropArea.y + cropArea.height}%`, left: 0, right: 0, bottom: 0 },
    left:   { top: `${cropArea.y}%`, left: 0, width: `${cropArea.x}%`, height: `${cropArea.height}%` },
    right:  { top: `${cropArea.y}%`, left: `${cropArea.x + cropArea.width}%`, right: 0, height: `${cropArea.height}%` },
  };

  return (
    <div className={cn("flex flex-col bg-white rounded-xl shadow-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-sm font-semibold text-zinc-900">Görsel Kırpma</h2>
          {naturalSize.w > 1 && (
            <span className="text-xs text-zinc-400">{naturalSize.w} × {naturalSize.h}</span>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Image canvas */}
        <div className="flex-1 flex items-center justify-center bg-zinc-900 p-6 overflow-hidden min-w-0">
          <div ref={containerRef} className="relative inline-block select-none">
            <img
              src={src}
              alt=""
              className="block max-w-full max-h-[520px]"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget;
                setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
              }}
            />

            {tab === "custom" && (
              <>
                {Object.values(overlays).map((style, i) => (
                  <div key={i} className="absolute bg-black/55 pointer-events-none" style={style} />
                ))}

                <div
                  className="absolute border border-white/80 cursor-move"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                  }}
                  onMouseDown={(e) => startDrag(e, "move")}
                >
                  {/* Rule-of-thirds grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[33.33, 66.66].map((p) => (
                      <React.Fragment key={p}>
                        <div className="absolute left-0 right-0 h-px bg-white/25" style={{ top: `${p}%` }} />
                        <div className="absolute top-0 bottom-0 w-px bg-white/25" style={{ left: `${p}%` }} />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Corner brackets */}
                  {(["tl", "tr", "bl", "br"] as const).map((c) => (
                    <div
                      key={c}
                      className="absolute w-4 h-4 pointer-events-none"
                      style={{
                        borderColor: "white",
                        borderStyle: "solid",
                        borderTopWidth: c.includes("t") ? 2 : 0,
                        borderBottomWidth: c.includes("b") ? 2 : 0,
                        borderLeftWidth: c.includes("l") ? 2 : 0,
                        borderRightWidth: c.includes("r") ? 2 : 0,
                        ...(c.includes("t") ? { top: 0 } : { bottom: 0 }),
                        ...(c.includes("l") ? { left: 0 } : { right: 0 }),
                      }}
                    />
                  ))}

                  {/* Resize handles */}
                  {(["tl", "tc", "tr", "ml", "mr", "bl", "bc", "br"] as HandleId[]).map((h) => (
                    <div
                      key={h}
                      className="absolute size-2.5 bg-white rounded-sm border border-zinc-300 shadow"
                      style={{
                        ...(h.includes("t") ? { top: -5 } : h.includes("b") ? { bottom: -5 } : { top: "calc(50% - 5px)" }),
                        ...(h.includes("l") ? { left: -5 } : h.includes("r") ? { right: -5 } : { left: "calc(50% - 5px)" }),
                        cursor: HANDLE_CURSORS[h],
                      }}
                      onMouseDown={(e) => startDrag(e, h)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="w-72 shrink-0 flex flex-col border-l border-zinc-200 bg-zinc-50">
          {/* Tabs */}
          <div className="flex shrink-0 border-b border-zinc-200">
            {(["auto", "custom"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-medium transition-colors",
                  tab === t
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-zinc-500 hover:text-zinc-700",
                )}
              >
                {t === "auto" ? "Otomatik Kesim" : "Özel Kesim"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {tab === "auto" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700">Kesim Boyutları</span>
                  <button
                    type="button"
                    onClick={() => setShowAdd((v) => !v)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showAdd ? "İptal" : "+ Ekle"}
                  </button>
                </div>

                {showAdd && (
                  <div className="rounded-lg bg-white border border-zinc-200 p-2.5 space-y-2">
                    <input
                      type="text"
                      placeholder="Boyut adı"
                      value={newSize.name}
                      onChange={(e) => setNewSize((s) => ({ ...s, name: e.target.value }))}
                      className="w-full text-xs rounded border border-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        placeholder="Genişlik (px)"
                        value={newSize.width}
                        onChange={(e) => setNewSize((s) => ({ ...s, width: e.target.value }))}
                        className="w-1/2 text-xs rounded border border-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      <input
                        type="number"
                        placeholder="Yükseklik (px)"
                        value={newSize.height}
                        onChange={(e) => setNewSize((s) => ({ ...s, height: e.target.value }))}
                        className="w-1/2 text-xs rounded border border-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSize.name || !newSize.width || !newSize.height) return;
                        setSizes((s) => [
                          ...s,
                          {
                            id: `custom-${Date.now()}`,
                            name: newSize.name,
                            width: Number(newSize.width),
                            height: Number(newSize.height),
                            enabled: true,
                          },
                        ]);
                        setNewSize({ name: "", width: "", height: "" });
                        setShowAdd(false);
                      }}
                      className="w-full text-xs rounded bg-blue-600 text-white py-1.5 hover:bg-blue-700 font-medium transition-colors"
                    >
                      Boyut Ekle
                    </button>
                  </div>
                )}

                {sizes.map((sz) => (
                  <label
                    key={sz.id}
                    className="flex items-center gap-2.5 rounded-lg bg-white border border-zinc-200 px-3 py-2 cursor-pointer hover:border-zinc-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={sz.enabled}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s) => (s.id === sz.id ? { ...s, enabled: e.target.checked } : s)),
                        )
                      }
                      className="rounded text-blue-600 accent-blue-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-800 truncate">{sz.name}</div>
                      <div className="text-xs text-zinc-400">{sz.width} × {sz.height} px</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSizes((prev) => prev.filter((s) => s.id !== sz.id));
                      }}
                      className="text-zinc-300 hover:text-red-400 transition-colors shrink-0"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </label>
                ))}

                {sizes.length === 0 && (
                  <p className="text-xs text-zinc-400 text-center py-4">
                    Henüz boyut eklenmedi
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-zinc-700 mb-2">En-Boy Oranı</div>
                  <div className="grid grid-cols-4 gap-1">
                    {ASPECT_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setAspectPreset(p.value)}
                        className={cn(
                          "py-1.5 text-xs rounded border font-medium transition-colors",
                          aspectPreset === p.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-blue-300",
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAspectPreset("custom")}
                      className={cn(
                        "py-1.5 text-xs rounded border font-medium transition-colors",
                        aspectPreset === "custom"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-blue-300",
                      )}
                    >
                      Özel
                    </button>
                  </div>

                  {aspectPreset === "custom" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={customAspect.w}
                        onChange={(e) => setCustomAspect((a) => ({ ...a, w: e.target.value }))}
                        className="w-16 text-xs rounded border border-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      <span className="text-zinc-400 text-sm font-bold">:</span>
                      <input
                        type="number"
                        min="1"
                        value={customAspect.h}
                        onChange={(e) => setCustomAspect((a) => ({ ...a, h: e.target.value }))}
                        className="w-16 text-xs rounded border border-zinc-200 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-white border border-zinc-200 px-3 py-2.5">
                  <div className="text-xs text-zinc-400 mb-0.5">Seçili Alan</div>
                  <div className="text-sm font-semibold text-zinc-800">
                    {Math.round((cropArea.width / 100) * naturalSize.w)} × {Math.round((cropArea.height / 100) * naturalSize.h)} px
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {cropArea.width.toFixed(1)}% × {cropArea.height.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}

            {/* Quality & Format */}
            <div className="border-t border-zinc-200 pt-3 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-zinc-700">Kalite</span>
                  <span className="text-xs font-semibold text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-700 mb-1.5">Format</div>
                <div className="flex gap-1">
                  {(["jpeg", "png", "webp"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={cn(
                        "flex-1 py-1.5 text-xs rounded border uppercase font-semibold tracking-wide transition-colors",
                        format === f
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-blue-300",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 p-3 border-t border-zinc-200 space-y-2">
            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded px-2 py-1.5">{error}</p>
            )}
            <button
              type="button"
              onClick={tab === "auto" ? runAutoProcess : runCustomCrop}
              disabled={processing || (tab === "auto" && enabledCount === 0)}
              className={cn(
                "w-full py-2 text-sm font-semibold rounded-lg transition-colors",
                processing || (tab === "auto" && enabledCount === 0)
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
              )}
            >
              {processing
                ? "İşleniyor..."
                : tab === "auto"
                  ? `${enabledCount} Boyutu İşle`
                  : "Kırp ve Kaydet"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-1.5 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="shrink-0 border-t border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <CheckIcon className="size-4 text-green-500" />
            <span className="text-xs font-semibold text-zinc-700">
              {results.length} görsel işlendi
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {results.map((r) => (
              <div key={r.id} className="flex flex-col items-center gap-1.5">
                <div className="relative size-16 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img src={r.dataUrl} alt={r.name} className="size-full object-cover" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-zinc-700 max-w-[64px] truncate">{r.name}</div>
                  <div className="text-xs text-zinc-400">{r.width}×{r.height}</div>
                  <a
                    href={r.dataUrl}
                    download={r.fileName}
                    className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <DownloadIcon className="size-3" />
                    İndir
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
