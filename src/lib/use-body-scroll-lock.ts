import { useEffect } from "react";

export function useBodyScrollLock(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [enabled]);
}
