import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType, EmblaPluginType } from "embla-carousel";
import { cn } from "../../lib/utils";

// ── Dynamic plugin imports ───────────────────

async function loadPlugin(name: string, opts: Record<string, unknown> = {}) {
  try {
    const mod = await import(/* @vite-ignore */ name);
    const factory = mod.default || mod;
    return factory(opts);
  } catch {
    return null;
  }
}

// ── Types ────────────────────────────────────

export type CarouselBreakpointOptions = EmblaOptionsType & {
  slidesPerView?: number | "auto";
};

export interface CarouselProps {
  slides: React.ReactNode[];

  // Core
  slidesPerView?: number | "auto";
  align?: EmblaOptionsType["align"];
  containScroll?: EmblaOptionsType["containScroll"];
  dragFree?: boolean;
  loop?: boolean;
  axis?: "x" | "y";
  direction?: "ltr" | "rtl";

  // Plugins
  autoplay?: boolean | Record<string, unknown>;
  autoScroll?: boolean | Record<string, unknown>;
  autoHeight?: boolean | Record<string, unknown>;
  fade?: boolean | Record<string, unknown>;
  wheelGestures?: boolean | Record<string, unknown>;
  classNames?: boolean | Record<string, unknown>;

  // Effects
  parallax?: boolean;
  opacity?: boolean;
  lazyLoad?: boolean;

  // Controls
  showNavigation?: boolean;
  showPagination?: boolean;
  scrollToIndex?: number;

  // Responsive
  breakpoints?: Record<string, CarouselBreakpointOptions>;

  // Styling
  className?: string;
  viewportClassName?: string;
  containerClassName?: string;
  slideClassName?: string;
  styles?: {
    controls?: string;
    navigation?: string;
    pagination?: string;
    prevButton?: string;
    nextButton?: string;
    dot?: string;
  };
}

// ── Icons ────────────────────────────────────

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ── Internal Hooks ───────────────────────────

function useDotButton(emblaApi: EmblaCarouselType | undefined) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    const id = setTimeout(() => { onInit(emblaApi); onSelect(emblaApi); }, 0);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
    return () => clearTimeout(id);
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, scrollSnaps, onDotButtonClick };
}

function usePrevNextButtons(emblaApi: EmblaCarouselType | undefined) {
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);

  const onPrevButtonClick = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNextButtonClick = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    const id = setTimeout(() => onSelect(emblaApi), 0);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
    return () => clearTimeout(id);
  }, [emblaApi, onSelect]);

  return { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick };
}

// ── Nav Buttons ──────────────────────────────

type NavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

function PrevButton({ className, ...restProps }: NavButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-full border bg-white/50 border-zinc-200/80 hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition-colors cursor-pointer",
        className,
      )}
      {...restProps}
    >
      <ChevronLeftIcon className="size-4" />
    </button>
  );
}

function NextButton({ className, ...restProps }: NavButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-full border bg-white/50 border-zinc-200/80 hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition-colors cursor-pointer",
        className,
      )}
      {...restProps}
    >
      <ChevronRightIcon className="size-4" />
    </button>
  );
}

// ── Component ────────────────────────────────

export function Carousel({
  slides,
  slidesPerView,
  align,
  containScroll,
  dragFree = false,
  loop = false,
  axis = "x",
  direction = "ltr",
  autoplay = false,
  autoScroll = false,
  autoHeight = false,
  fade: fadeProp = false,
  wheelGestures: wheelGesturesProp = true,
  classNames: classNamesProp = false,
  parallax = false,
  opacity = false,
  lazyLoad = false,
  showNavigation = false,
  showPagination = false,
  scrollToIndex,
  breakpoints,
  className,
  viewportClassName,
  containerClassName,
  slideClassName,
  styles,
}: CarouselProps) {
  const [plugins, setPlugins] = React.useState<EmblaPluginType[]>([]);
  const [pluginsReady, setPluginsReady] = React.useState(false);

  // Build plugins async
  React.useEffect(() => {
    let cancelled = false;

    async function buildPlugins() {
      const active: (EmblaPluginType | null)[] = [];

      if (autoplay) {
        const opts = typeof autoplay === "object" ? autoplay : { delay: 4000 };
        active.push(await loadPlugin("embla-carousel-autoplay", opts));
      }
      if (autoScroll) {
        const opts = typeof autoScroll === "object" ? autoScroll : { speed: 2 };
        active.push(await loadPlugin("embla-carousel-auto-scroll", opts));
      }
      if (autoHeight) {
        const opts = typeof autoHeight === "object" ? autoHeight : {};
        active.push(await loadPlugin("embla-carousel-auto-height", opts));
      }
      if (fadeProp) {
        const opts = typeof fadeProp === "object" ? fadeProp : {};
        active.push(await loadPlugin("embla-carousel-fade", opts));
      }
      if (wheelGesturesProp) {
        const opts = typeof wheelGesturesProp === "object" ? wheelGesturesProp : {};
        active.push(await loadPlugin("embla-carousel-wheel-gestures", opts));
      }
      if (classNamesProp) {
        const opts = typeof classNamesProp === "object" ? classNamesProp : {};
        active.push(await loadPlugin("embla-carousel-class-names", opts));
      }

      if (!cancelled) {
        setPlugins(active.filter(Boolean) as EmblaPluginType[]);
        setPluginsReady(true);
      }
    }

    buildPlugins();
    return () => { cancelled = true; };
  }, [autoplay, autoScroll, autoHeight, fadeProp, wheelGesturesProp, classNamesProp]);

  // Core options
  const coreOptions: EmblaOptionsType = React.useMemo(() => {
    const opts: Record<string, unknown> = { dragFree, loop, axis, direction };
    if (align !== undefined) opts.align = align;
    if (containScroll !== undefined) opts.containScroll = containScroll;
    if (breakpoints !== undefined) opts.breakpoints = breakpoints;
    return opts as EmblaOptionsType;
  }, [align, containScroll, dragFree, loop, axis, direction, breakpoints]);

  // Resolved slidesPerView
  const [resolvedSlidesPerView, setResolvedSlidesPerView] = React.useState<number | "auto" | undefined>(slidesPerView);

  const slideStyle = React.useMemo(() => {
    if (typeof resolvedSlidesPerView === "number") {
      return { flex: `0 0 ${100 / resolvedSlidesPerView}%`, minWidth: 0 };
    }
    return undefined;
  }, [resolvedSlidesPerView]);

  // Initialize Embla
  const [emblaRef, emblaApi] = useEmblaCarousel(coreOptions, plugins);

  // scrollToIndex
  React.useEffect(() => {
    if (emblaApi && scrollToIndex !== undefined) {
      emblaApi.scrollTo(scrollToIndex);
    }
  }, [emblaApi, scrollToIndex]);

  // autoHeight: ensure correct height after images load
  React.useEffect(() => {
    if (!emblaApi || !autoHeight) return;

    const slideNodes = emblaApi.slideNodes();
    const handleLoad = () => emblaApi.reInit();

    slideNodes.forEach((slide, i) => {
      const images = slide.querySelectorAll("img");
      images.forEach((img) => {
        if (i === 0 && img.loading === "lazy") img.loading = "eager";
        if (!img.complete) {
          img.addEventListener("load", handleLoad, { once: true });
          img.addEventListener("error", handleLoad, { once: true });
        }
      });
    });

    const raf = requestAnimationFrame(() => emblaApi.reInit());

    return () => {
      cancelAnimationFrame(raf);
      slideNodes.forEach((slide) => {
        slide.querySelectorAll("img").forEach((img) => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleLoad);
        });
      });
    };
  }, [emblaApi, autoHeight]);

  // Breakpoint-responsive slidesPerView
  React.useEffect(() => {
    if (!emblaApi) return;

    const onReInit = () => {
      const engine = emblaApi.internalEngine();
      if (!engine) return;

      const engineOptions = engine.options as CarouselBreakpointOptions;
      if (engineOptions.slidesPerView !== undefined) {
        setResolvedSlidesPerView(engineOptions.slidesPerView);
      } else {
        setResolvedSlidesPerView(slidesPerView);
      }
    };

    emblaApi.on("reInit", onReInit);
    emblaApi.on("init", onReInit);
    onReInit();

    return () => {
      emblaApi.off("reInit", onReInit);
      emblaApi.off("init", onReInit);
    };
  }, [emblaApi, slidesPerView]);

  // Lazy load tracking
  const [slidesInView, setSlidesInView] = React.useState<number[]>([]);

  const updateSlidesInView = React.useCallback((api: EmblaCarouselType) => {
    setSlidesInView((prev) => {
      if (prev.length === api.slideNodes().length) return prev;
      const inView = api.slidesInView();
      const merged = new Set([...prev, ...inView]);
      if (merged.size === prev.length) return prev;
      return Array.from(merged);
    });
  }, []);

  React.useEffect(() => {
    if (!emblaApi || !lazyLoad) return;
    updateSlidesInView(emblaApi);
    emblaApi.on("slidesInView", updateSlidesInView);
    emblaApi.on("reInit", updateSlidesInView);
    return () => {
      emblaApi.off("slidesInView", updateSlidesInView);
      emblaApi.off("reInit", updateSlidesInView);
    };
  }, [emblaApi, lazyLoad, updateSlidesInView]);

  // Parallax & opacity tween
  const simpleTween = React.useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slideNodes = api.slideNodes();
    const locations = api.scrollSnapList();

    slideNodes.forEach((slide, index) => {
      const targetNode = slide.querySelector(".carousel__parallax-layer") as HTMLElement || slide;
      if (!targetNode) return;

      let distance = locations[index] - scrollProgress;

      if (engine.options.loop) {
        if (distance < -0.5) distance += 1;
        if (distance > 0.5) distance -= 1;
      }

      if (parallax) {
        const factor = 15;
        const x = distance * factor * 100;
        targetNode.style.transform = axis === "y"
          ? `translate3d(0, ${x}%, 0)`
          : `translate3d(${x}%, 0, 0)`;
      }

      if (opacity) {
        const factor = 2.5;
        const opacityValue = Math.max(0, 1 - Math.abs(distance * factor));
        slide.style.opacity = (0.3 + opacityValue * 0.7).toString();
      }
    });
  }, [parallax, opacity, axis]);

  React.useEffect(() => {
    if (!emblaApi || (!parallax && !opacity)) return;

    const onScroll = () => simpleTween(emblaApi);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("resize", onScroll);
    simpleTween(emblaApi);

    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("resize", onScroll);
    };
  }, [emblaApi, simpleTween, parallax, opacity]);

  // Hooks
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const isVertical = axis === "y";
  const isRTL = direction === "rtl";

  if (!pluginsReady && (autoplay || autoScroll || autoHeight || fadeProp || classNamesProp)) {
    return null;
  }

  return (
    <div className={cn(isRTL && "direction-rtl", className)} dir={isRTL ? "rtl" : undefined}>
      <div
        className={cn("overflow-hidden", isVertical && "h-125", autoHeight && "transition-[height] duration-200", viewportClassName)}
        ref={emblaRef}
      >
        <div className={cn(
          "flex",
          isVertical ? "flex-col h-full" : "touch-pan-y touch-pinch-zoom",
          autoHeight && "items-start",
          containerClassName,
        )}>
          {slides.map((slide, index) => {
            const isLoaded = !lazyLoad || slidesInView.includes(index);
            return (
              <div
                className={cn("flex-none min-w-0 relative", slideClassName)}
                key={index}
                style={slideStyle}
              >
                <div className={cn("carousel__parallax-layer w-full", !autoHeight && "h-full")}>
                  {isLoaded ? slide : (
                    <div className="w-full h-full bg-zinc-100/10 animate-pulse rounded-lg min-h-50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(showNavigation || showPagination) && (
        <div className={cn(styles?.controls || "flex justify-between items-center gap-5 mt-4 px-1")}>
          {showNavigation && (
            <div className={cn(styles?.navigation || "flex gap-2 items-center")}>
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className={styles?.prevButton} />
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className={styles?.nextButton} />
            </div>
          )}

          {showPagination && (
            <div className={cn(styles?.pagination || "flex flex-wrap justify-end items-center gap-2.5 leading-none")}>
              {scrollSnaps.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={cn(
                    styles?.dot
                      ? cn(styles.dot, index === selectedIndex ? "opacity-100 bg-current scale-110 border-current!" : "opacity-40")
                      : cn(
                        "w-2.5 h-2.5 rounded-full border bg-transparent flex items-center justify-center cursor-pointer touch-manipulation transition-all duration-300",
                        index === selectedIndex
                          ? "border-zinc-800 border-[2.5px] scale-110"
                          : "border-zinc-300 hover:border-zinc-400 border-[1.5px]",
                      ),
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
