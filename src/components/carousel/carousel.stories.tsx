import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Carousel, type CarouselProps } from "./carousel";

const SHADES = [
  "bg-zinc-800", "bg-zinc-700", "bg-zinc-600", "bg-zinc-500",
  "bg-zinc-800", "bg-zinc-700", "bg-zinc-600", "bg-zinc-500",
];

function Slide({ index, height }: { index: number; height?: number }) {
  return (
    <div
      className={`${SHADES[index % SHADES.length]} rounded-xl flex items-center justify-center text-white font-bold text-lg select-none`}
      style={{ height: height || 200 }}
    >
      Slide {index + 1}
    </div>
  );
}

function makeSlides(count: number, height?: number) {
  return Array.from({ length: count }, (_, i) => <Slide key={i} index={i} height={height} />);
}

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A carousel component built on Embla with navigation, pagination, loop, autoplay, auto-scroll, fade, parallax, lazy loading, RTL, and responsive breakpoints.",
      },
    },
  },
  args: {
    showNavigation: true,
    showPagination: true,
    loop: false,
    dragFree: false,
    axis: "x",
    direction: "ltr",
    align: "start",
    containScroll: "trimSnaps",
    slidesPerView: 3,
    autoplay: false,
    autoScroll: false,
    autoHeight: false,
    fade: false,
    wheelGestures: false,
    parallax: false,
    opacity: false,
    lazyLoad: false,
  },
  argTypes: {
    // ── Core ────────────────────────────────────
    slidesPerView: {
      control: { type: "number", min: 1, max: 6, step: 1 },
      description: "Number of slides visible at once. Use `\"auto\"` for variable-width slides.",
    },
    loop: {
      control: "boolean",
      description: "Enables infinite loop scrolling.",
    },
    dragFree: {
      control: "boolean",
      description: "Allows free dragging without snapping to slides.",
    },
    axis: {
      control: "radio",
      options: ["x", "y"],
      description: "Scroll axis — horizontal or vertical.",
    },
    direction: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "Text/scroll direction. RTL flips navigation icon directions.",
    },
    align: {
      control: "radio",
      options: ["start", "center", "end"],
      description: "Alignment of the selected slide within the viewport.",
    },
    containScroll: {
      control: "radio",
      options: ["trimSnaps", "keepSnaps", false],
      description: "How scroll snaps are contained at the edges.",
    },

    // ── Controls ─────────────────────────────────
    showNavigation: {
      control: "boolean",
      description: "Show prev/next navigation buttons.",
    },
    showPagination: {
      control: "boolean",
      description: "Show dot pagination indicators.",
    },

    // ── Plugins ──────────────────────────────────
    autoplay: {
      control: "boolean",
      description: "Auto-advance slides. Pass an object to customize: `{ delay: 3000, stopOnInteraction: true }`.",
    },
    autoScroll: {
      control: "boolean",
      description: "Continuously scroll slides. Pass an object to customize: `{ speed: 2 }`.",
    },
    autoHeight: {
      control: "boolean",
      description: "Automatically adjusts the carousel height to the tallest visible slide.",
    },
    fade: {
      control: "boolean",
      description: "Cross-fade transition between slides instead of sliding. Requires `slidesPerView={1}`.",
    },
    wheelGestures: {
      control: "boolean",
      description: "Enables mouse wheel / trackpad scrolling.",
    },

    // ── Effects ──────────────────────────────────
    parallax: {
      control: "boolean",
      description: "Applies a parallax depth effect to slide content.",
    },
    opacity: {
      control: "boolean",
      description: "Fades non-active slides to partial opacity.",
    },
    lazyLoad: {
      control: "boolean",
      description: "Defers rendering of off-screen slides until they scroll into view.",
    },

    // ── Hide complex props from controls ─────────
    slides: { table: { disable: true } },
    breakpoints: { table: { disable: true } },
    scrollToIndex: { table: { disable: true } },
    styles: { table: { disable: true } },
    className: { table: { disable: true } },
    viewportClassName: { table: { disable: true } },
    containerClassName: { table: { disable: true } },
    slideClassName: { table: { disable: true } },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// ── Playground ───────────────────────────────

export const Playground: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(8)} slideClassName="px-2" />
    </div>
  ),
};

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6)} slidesPerView={3} slideClassName="px-2" />
    </div>
  ),
};

// ── slidesPerView: "auto" ────────────────────

export const SlidesPerViewAuto: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(8)} slidesPerView="auto" slideClassName="w-48 mr-3" />
    </div>
  ),
};

// ── Loop ─────────────────────────────────────

export const Loop: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(5)} slidesPerView={3} loop slideClassName="px-2" />
    </div>
  ),
};

// ── Autoplay ─────────────────────────────────

export const Autoplay: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6)} slidesPerView={3} loop autoplay={{ delay: 2000 }} showNavigation={false} slideClassName="px-2" />
    </div>
  ),
};

// ── AutoScroll ───────────────────────────────

export const AutoScroll: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(8)} slidesPerView={4} loop autoScroll showNavigation={false} showPagination={false} slideClassName="px-2" />
    </div>
  ),
};

// ── Fade ─────────────────────────────────────

export const Fade: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(4, 250)} slidesPerView={1} fade loop />
    </div>
  ),
};

// ── Wheel Gestures ───────────────────────────

export const WheelGestures: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <p className="mb-3 text-sm text-zinc-500">Scroll with your mouse wheel or trackpad over the carousel.</p>
      <Carousel {...args} slides={makeSlides(8)} slidesPerView={3} wheelGestures slideClassName="px-2" />
    </div>
  ),
};

// ── Parallax ─────────────────────────────────

export const Parallax: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6, 220)} slidesPerView={3} loop parallax slideClassName="px-2 overflow-hidden rounded-xl" />
    </div>
  ),
};

// ── Opacity ──────────────────────────────────

export const Opacity: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6, 200)} slidesPerView={3} loop opacity slideClassName="px-2" />
    </div>
  ),
};

// ── RTL ──────────────────────────────────────

export const RTL: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6)} slidesPerView={3} direction="rtl" slideClassName="px-2" />
    </div>
  ),
};

// ── Vertical Axis ────────────────────────────

export const VerticalAxis: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-md">
      <Carousel {...args} slides={makeSlides(5, 180)} axis="y" viewportClassName="h-75" slideClassName="pb-3" />
    </div>
  ),
};

// ── Drag Free ────────────────────────────────

export const DragFree: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(8)} slidesPerView={3} dragFree slideClassName="px-2" />
    </div>
  ),
};

// ── Lazy Loading ─────────────────────────────

export const LazyLoading: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(12)} slidesPerView={3} lazyLoad slideClassName="px-2" />
    </div>
  ),
};

// ── Breakpoints (Responsive) ─────────────────

export const Breakpoints: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-3xl">
      <Carousel
        {...args}
        slides={makeSlides(8)}
        slidesPerView={1}
        slideClassName="px-2"
        breakpoints={{
          "(min-width: 640px)": { slidesPerView: 2 },
          "(min-width: 1024px)": { slidesPerView: 4 },
        }}
      />
    </div>
  ),
};

// ── scrollToIndex (Programmatic) ─────────────

export const ScrollToIndex: Story = {
  render: (args: CarouselProps) => {
    const [scrollIndex, setScrollIndex] = useState(0);
    return (
      <div className="max-w-xl">
        <div className="flex gap-2 mb-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Button
              key={i}
              variant={scrollIndex === i ? "solid" : "outline"}
              size="xs"
              onClick={() => setScrollIndex(i)}
            >
              Slide {i + 1}
            </Button>
          ))}
        </div>
        <Carousel {...args} slides={makeSlides(5, 200)} slidesPerView={1} scrollToIndex={scrollIndex} showNavigation={false} />
      </div>
    );
  },
};

// ── Auto Height ──────────────────────────────

export const AutoHeight: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel
        {...args}
        slides={[
          <Slide key={0} index={0} height={150} />,
          <Slide key={1} index={1} height={250} />,
          <Slide key={2} index={2} height={180} />,
          <Slide key={3} index={3} height={300} />,
        ]}
        slidesPerView={1}
        autoHeight
      />
    </div>
  ),
};

// ── Align Center ─────────────────────────────

export const AlignCenter: Story = {
  render: (args: CarouselProps) => (
    <div className="max-w-xl">
      <Carousel {...args} slides={makeSlides(6)} align="center" slidesPerView={2} slideClassName="px-2" />
    </div>
  ),
};
