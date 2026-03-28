import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Carousel, type CarouselProps } from "./carousel";

const COLORS = [
  "bg-blue-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400",
  "bg-violet-400", "bg-cyan-400", "bg-pink-400", "bg-indigo-400",
];

function Slide({ index, height }: { index: number; height?: number }) {
  return (
    <div
      className={`${COLORS[index % COLORS.length]} rounded-xl flex items-center justify-center text-white font-bold text-lg select-none`}
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
  args: {
    showNavigation: true,
    showPagination: true,
    loop: false,
    dragFree: false,
    axis: "x",
    direction: "ltr",
  },
  argTypes: {
    slidesPerView: { control: { type: "number", min: 1, max: 5 } },
    loop: { control: "boolean" },
    dragFree: { control: "boolean" },
    showNavigation: { control: "boolean" },
    showPagination: { control: "boolean" },
    axis: { control: "select", options: ["x", "y"] },
    direction: { control: "select", options: ["ltr", "rtl"] },
    align: { control: "select", options: ["start", "center", "end"] },
    parallax: { control: "boolean" },
    opacity: { control: "boolean" },
    lazyLoad: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(6)} slidesPerView={3} slideClassName="px-2" />
    </div>
  ),
};

// ── slidesPerView: "auto" ────────────────────

export const SlidesPerViewAuto: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(8)} slidesPerView="auto" slideClassName="w-48 mr-3" />
    </div>
  ),
};

// ── Loop ─────────────────────────────────────

export const Loop: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(5)} slidesPerView={3} loop slideClassName="px-2" />
    </div>
  ),
};

// ── Autoplay ─────────────────────────────────

export const Autoplay: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(6)} slidesPerView={3} loop autoplay={{ delay: 2000 }} showNavigation={false} slideClassName="px-2" />
    </div>
  ),
};

// ── AutoScroll ───────────────────────────────

export const AutoScroll: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(8)} slidesPerView={4} loop autoScroll showNavigation={false} showPagination={false} slideClassName="px-2" />
    </div>
  ),
};

// ── Fade ─────────────────────────────────────

export const Fade: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(4, 250)} slidesPerView={1} fade loop />
    </div>
  ),
};

// ── Parallax ─────────────────────────────────

export const Parallax: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(6, 220)} slidesPerView={3} loop parallax slideClassName="px-2 overflow-hidden" />
    </div>
  ),
};

// ── Opacity ──────────────────────────────────

export const Opacity: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(6, 200)} slidesPerView={3} loop opacity slideClassName="px-2" />
    </div>
  ),
};

// ── Vertical Axis ────────────────────────────

export const VerticalAxis: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 400 }}>
      <Carousel {...args} slides={makeSlides(5, 180)} axis="y" viewportClassName="h-[300px]" slideClassName="pb-3" />
    </div>
  ),
};

// ── Drag Free ────────────────────────────────

export const DragFree: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(8)} slidesPerView={3} dragFree slideClassName="px-2" />
    </div>
  ),
};

// ── Lazy Loading ─────────────────────────────

export const LazyLoading: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(12)} slidesPerView={3} lazyLoad slideClassName="px-2" />
    </div>
  ),
};

// ── Breakpoints (Responsive) ─────────────────

export const Breakpoints: Story = {
  render: (args: CarouselProps) => (
    <div style={{ maxWidth: 800 }}>
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
      <div style={{ maxWidth: 600 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
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
    <div style={{ maxWidth: 600 }}>
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
    <div style={{ maxWidth: 600 }}>
      <Carousel {...args} slides={makeSlides(6)} align="center" slidesPerView={2} slideClassName="px-2" />
    </div>
  ),
};
