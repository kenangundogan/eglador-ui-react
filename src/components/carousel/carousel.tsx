"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType, EmblaPluginType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";
import AutoHeight from "embla-carousel-auto-height";
import Fade from "embla-carousel-fade";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import ClassNames from "embla-carousel-class-names";
import { cn } from "../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../lib/icons";

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
  fade?: boolean;
  wheelGestures?: boolean;
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

type NavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; isRTL?: boolean };

function PrevButton({ className, isRTL, ...restProps }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label="Previous slide"
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-full border bg-white/50 border-zinc-200/80 hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition-colors cursor-pointer",
        className,
      )}
      {...restProps}
    >
      {isRTL ? <ChevronRightIcon className="size-4" strokeWidth={2.5} /> : <ChevronLeftIcon className="size-4" strokeWidth={2.5} />}
    </button>
  );
}

function NextButton({ className, isRTL, ...restProps }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label="Next slide"
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-full border bg-white/50 border-zinc-200/80 hover:bg-white hover:border-zinc-300 disabled:opacity-40 transition-colors cursor-pointer",
        className,
      )}
      {...restProps}
    >
      {isRTL ? <ChevronLeftIcon className="size-4" strokeWidth={2.5} /> : <ChevronRightIcon className="size-4" strokeWidth={2.5} />}
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
  wheelGestures: wheelGesturesProp = false,
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
  // Build plugins synchronously
  const plugins = React.useMemo<EmblaPluginType[]>(() => {
    const active: EmblaPluginType[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (autoplay) active.push(Autoplay(typeof autoplay === "object" ? autoplay as any : { delay: 4000 }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (autoScroll) active.push(AutoScroll(typeof autoScroll === "object" ? autoScroll as any : { speed: 2 }));
    if (autoHeight) active.push(AutoHeight());
    if (fadeProp) active.push(Fade());
    if (wheelGesturesProp) active.push(WheelGesturesPlugin());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (classNamesProp) active.push(ClassNames(typeof classNamesProp === "object" ? classNamesProp as any : {}));
    return active;
  }, [autoplay, autoScroll, autoHeight, fadeProp, wheelGesturesProp, classNamesProp]);

  // Core options
  const coreOptions: EmblaOptionsType = React.useMemo(() => {
    const opts: Record<string, unknown> = { dragFree, loop, axis, direction };
    if (align !== undefined) opts.align = align;
    if (containScroll !== undefined) opts.containScroll = containScroll;
    if (breakpoints !== undefined) opts.breakpoints = breakpoints;
    return opts as EmblaOptionsType;
  }, [align, containScroll, dragFree, loop, axis, direction, breakpoints]);

  // Resolved slidesPerView — fade plugin forces 1 slide at a time
  const [resolvedSlidesPerView, setResolvedSlidesPerView] = React.useState<number | "auto" | undefined>(
    fadeProp ? 1 : slidesPerView,
  );

  const slideStyle = React.useMemo(() => {
    const effective = fadeProp ? 1 : resolvedSlidesPerView;
    if (typeof effective === "number") {
      return { flex: `0 0 ${100 / effective}%`, minWidth: 0 };
    }
    return undefined;
  }, [fadeProp, resolvedSlidesPerView]);

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

  // Parallax & opacity tween — uses slideRegistry so multi-slide-per-view works correctly
  const simpleTween = React.useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slideNodes = api.slideNodes();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      const slidesInSnap: number[] = engine.slideRegistry[snapIndex];
      if (!slidesInSnap) return;

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        let diffToTarget = scrollSnap - scrollProgress;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const loopTarget = loopItem.target();
            if (slideIndex === loopItem.index && loopTarget !== 0) {
              const sign = Math.sign(loopTarget);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const slide = slideNodes[slideIndex];
        if (!slide) return;

        if (parallax) {
          const layer = (slide.querySelector(".carousel__parallax-layer") as HTMLElement) ?? slide;
          const x = diffToTarget * 15 * 100;
          layer.style.transform = axis === "y"
            ? `translate3d(0, ${x}%, 0)`
            : `translate3d(${x}%, 0, 0)`;
        }

        if (opacity) {
          const opacityValue = Math.max(0, 1 - Math.abs(diffToTarget * 2.5));
          slide.style.opacity = String(0.3 + opacityValue * 0.7);
        }
      });
    });
  }, [parallax, opacity, axis]);

  React.useEffect(() => {
    if (!emblaApi || (!parallax && !opacity)) return;

    const onScroll = () => simpleTween(emblaApi, "scroll");
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
              <PrevButton isRTL={isRTL} onClick={onPrevButtonClick} disabled={prevBtnDisabled} className={styles?.prevButton} />
              <NextButton isRTL={isRTL} onClick={onNextButtonClick} disabled={nextBtnDisabled} className={styles?.nextButton} />
            </div>
          )}

          {showPagination && (
            <div className={cn(styles?.pagination || "flex flex-wrap justify-end items-center gap-2.5 leading-none")}>
              {scrollSnaps.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
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

Carousel.displayName = "Carousel";
