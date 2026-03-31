"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

// ── Types ────────────────────────────────────

export interface TypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  deleteMode?: "backspace" | "clear";
  loop?: boolean;
  startDelay?: number;
  cursor?: boolean;
  cursorStyle?: "line" | "block" | "underscore";
  onComplete?: () => void;
  className?: string;
}

// ── Component ────────────────────────────────

export function Typewriter({
  texts,
  typingSpeed = 40,
  deletingSpeed = 25,
  pauseDuration = 3000,
  deleteMode = "backspace",
  loop = true,
  startDelay = 0,
  cursor = true,
  cursorStyle = "line",
  onComplete,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [textIndex, setTextIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"waiting" | "typing" | "pausing" | "deleting" | "done">(
    startDelay > 0 ? "waiting" : "typing",
  );

  React.useEffect(() => {
    if (phase !== "waiting") return;
    const timeout = setTimeout(() => setPhase("typing"), startDelay);
    return () => clearTimeout(timeout);
  }, [phase, startDelay]);

  const getDelay = React.useCallback(() => {
    switch (phase) {
      case "typing": return typingSpeed;
      case "pausing": return pauseDuration;
      case "deleting": return deleteMode === "clear" ? 0 : deletingSpeed;
      default: return 0;
    }
  }, [phase, typingSpeed, pauseDuration, deletingSpeed, deleteMode]);

  React.useEffect(() => {
    if (phase === "waiting" || phase === "done" || !texts.length) return;

    const currentFullText = texts[textIndex];

    const timeout = setTimeout(() => {
      switch (phase) {
        case "typing":
          if (displayText.length < currentFullText.length) {
            setDisplayText(currentFullText.slice(0, displayText.length + 1));
          } else {
            if (!loop && textIndex === texts.length - 1) {
              setPhase("done");
              onComplete?.();
            } else {
              setPhase("pausing");
            }
          }
          break;

        case "pausing":
          setPhase("deleting");
          break;

        case "deleting":
          if (deleteMode === "clear") {
            setDisplayText("");
            setTextIndex((prev) => (prev + 1) % texts.length);
            setPhase("typing");
          } else {
            if (displayText.length > 0) {
              setDisplayText(displayText.slice(0, -1));
            } else {
              setTextIndex((prev) => (prev + 1) % texts.length);
              setPhase("typing");
            }
          }
          break;
      }
    }, getDelay());

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, phase, texts, deleteMode, getDelay, loop, onComplete]);

  const cursorElement = cursor && phase !== "done" && (
    <span
      className={cn(
        "inline-block bg-current animate-pulse align-baseline ml-0.5",
        cursorStyle === "line" && "w-px h-[1em]",
        cursorStyle === "block" && "w-[0.6em] h-[1.1em] opacity-70",
        cursorStyle === "underscore" && "w-[0.6em] h-px translate-y-[0.1em]",
      )}
    />
  );

  return (
    <span className={cn(className)}>
      {displayText}
      {cursorElement}
    </span>
  );
}

Typewriter.displayName = "Typewriter";
