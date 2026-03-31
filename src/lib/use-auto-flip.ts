import { useEffect, useState } from "react";

export type FlipSide = "top" | "bottom" | "left" | "right";

export function useAutoFlip(
  triggerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  preferredSide: FlipSide,
  enabled: boolean = true,
): FlipSide {
  const [currentSide, setCurrentSide] = useState(preferredSide);

  useEffect(() => {
    if (!enabled || !triggerRef.current || !contentRef.current) {
      setCurrentSide(preferredSide);
      return;
    }

    const measure = () => {
      if (!triggerRef.current || !contentRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const { innerHeight, innerWidth } = window;

      let newSide = preferredSide;

      if (preferredSide === "bottom") {
        if (triggerRect.bottom + contentRect.height > innerHeight && triggerRect.top > contentRect.height) {
          newSide = "top";
        }
      } else if (preferredSide === "top") {
        if (triggerRect.top - contentRect.height < 0 && innerHeight - triggerRect.bottom > contentRect.height) {
          newSide = "bottom";
        }
      } else if (preferredSide === "right") {
        if (triggerRect.right + contentRect.width > innerWidth && triggerRect.left > contentRect.width) {
          newSide = "left";
        }
      } else if (preferredSide === "left") {
        if (triggerRect.left - contentRect.width < 0 && innerWidth - triggerRect.right > contentRect.width) {
          newSide = "right";
        }
      }

      setCurrentSide(newSide);
    };

    const timer = requestAnimationFrame(measure);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(timer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [triggerRef, contentRef, preferredSide, enabled]);

  return currentSide;
}
