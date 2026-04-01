"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { VideoIcon } from "../../lib/icons";

// ── Types ────────────────────────────────────

export type MediaVideoRatio = "1:1" | "16:9" | "4:3" | "1:2" | "free";
export type MediaVideoSize = "xs" | "sm" | "md" | "lg";
export type MediaVideoShape = "square" | "rounded" | "circle";

export interface MediaVideoProps {
  src: string;
  caption?: string;
  ratio?: MediaVideoRatio;
  size?: MediaVideoSize;
  shape?: MediaVideoShape;
  children?: React.ReactNode;
  hideCaption?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onError?: () => void;
  className?: string;
}

// ── Shape definitions ────────────────────────

const SHAPES: Record<MediaVideoShape, string | null> = {
  square: "",
  rounded: null,
  circle: "rounded-full",
};

// ── Ratio definitions ────────────────────────

const RATIOS: Record<MediaVideoRatio, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:2": "aspect-[1/2]",
  "free": "",
};

// ── Size definitions ─────────────────────────

const SIZES: Record<MediaVideoSize, {
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

// ── Component ────────────────────────────────

export function MediaVideo({
  src,
  caption,
  ratio = "16:9",
  size = "sm",
  shape = "rounded",
  children,
  hideCaption = false,
  controls = true,
  preload = "metadata",
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  onError,
  className,
}: MediaVideoProps) {
  const [hasError, setHasError] = React.useState(false);
  const s = SIZES[size];
  const ratioClass = RATIOS[ratio];
  const shapeClass = SHAPES[shape] ?? s.rounded;

  if (hasError || !src) {
    return (
      <div className="flex flex-col">
        <div className={cn("overflow-hidden flex flex-col", shapeClass, className)}>
          <div className={cn(
            "relative bg-zinc-900 flex flex-col items-center justify-center",
            ratioClass,
          )}>
            <div className="flex flex-col justify-center items-center gap-2 p-4 text-center">
              <VideoIcon className={cn(s.errorIconSize, "text-zinc-500")} />
              <span className={cn(s.errorFont, "text-zinc-500")}>Video could not be loaded</span>
            </div>
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
      <div className={cn("overflow-hidden flex flex-col", shapeClass, className)}>
        <div className={cn("relative bg-black", ratioClass)}>
          <video
            src={src}
            controls={controls}
            preload={preload}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            poster={poster}
            className="w-full h-full object-contain"
            onError={() => { setHasError(true); onError?.(); }}
          />
        </div>
        {children}
      </div>
      {caption && !hideCaption && (
        <p className={cn("text-zinc-500 line-clamp-2 mt-1.5", s.captionFont)}>{caption}</p>
      )}
    </div>
  );
}

MediaVideo.displayName = "MediaVideo";
