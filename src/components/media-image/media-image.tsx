import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export type MediaImageRatio = "1:1" | "16:9" | "4:3" | "1:2" | "free";
export type MediaImageSize = "xs" | "sm" | "md" | "lg";
export type MediaImageShape = "square" | "rounded" | "circle";

export interface MediaImageProps {
  src: string;
  alt: string;
  caption?: string;
  ratio?: MediaImageRatio;
  size?: MediaImageSize;
  shape?: MediaImageShape;
  children?: React.ReactNode;
  hideCaption?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none";
  loading?: "lazy" | "eager";
  onError?: () => void;
  className?: string;
}

// ── Icons ────────────────────────────────────

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

// ── Shape definitions ────────────────────────

const SHAPES: Record<MediaImageShape, string | null> = {
  square: "",
  rounded: null,
  circle: "rounded-full",
};

// ── Ratio definitions ────────────────────────

const RATIOS: Record<MediaImageRatio, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:2": "aspect-[1/2]",
  "free": "",
};

// ── Size definitions ─────────────────────────

const SIZES: Record<MediaImageSize, {
  rounded: string;
  captionFont: string;
  errorIconSize: string;
  errorFont: string;
}> = {
  xs: { rounded: "rounded-lg", captionFont: "text-xs", errorIconSize: "size-6", errorFont: "text-[10px]" },
  sm: { rounded: "rounded-xl", captionFont: "text-sm", errorIconSize: "size-8", errorFont: "text-xs" },
  md: { rounded: "rounded-2xl", captionFont: "text-base", errorIconSize: "size-10", errorFont: "text-sm" },
  lg: { rounded: "rounded-2xl", captionFont: "text-base", errorIconSize: "size-10", errorFont: "text-sm" },
};

// ── Object fit ───────────────────────────────

const OBJECT_FIT: Record<string, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

// ── Component ────────────────────────────────

export function MediaImage({
  src,
  alt,
  caption,
  ratio = "16:9",
  size = "sm",
  shape = "rounded",
  children,
  hideCaption = false,
  objectFit = "cover",
  loading = "lazy",
  onError,
  className,
}: MediaImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const s = SIZES[size];
  const ratioClass = RATIOS[ratio];
  const shapeClass = SHAPES[shape] ?? s.rounded;

  if (hasError || !src) {
    return (
      <div className="flex flex-col">
        <div className={cn(
          "relative overflow-hidden bg-zinc-100 flex flex-col items-center justify-center gap-2 group",
          ratioClass, shapeClass, className,
        )}>
          <div className="flex flex-col justify-center items-center gap-2 p-4 text-center">
            <CameraIcon className={cn(s.errorIconSize, "text-zinc-300")} />
            <span className={cn(s.errorFont, "text-zinc-400")}>Image could not be loaded</span>
          </div>
          {children}
        </div>
        {caption && !hideCaption && (
          <p className={cn("text-zinc-500 line-clamp-2 mt-1.5", s.captionFont)}>{caption}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className={cn(
        "relative overflow-hidden group bg-zinc-100 flex flex-col",
        ratioClass, shapeClass, className,
      )}>
        <img
          src={src}
          alt={alt}
          className={cn("w-full", ratio !== "free" && "h-full", OBJECT_FIT[objectFit])}
          loading={loading}
          onError={() => { setHasError(true); onError?.(); }}
        />
        {children}
      </div>
      {caption && !hideCaption && (
        <p className={cn("text-zinc-500 line-clamp-2 mt-1.5", s.captionFont)}>{caption}</p>
      )}
    </div>
  );
}
