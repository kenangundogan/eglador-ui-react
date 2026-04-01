import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaVideo, type MediaVideoProps } from "./media-video";

const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const SAMPLE_POSTER = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80";

const meta: Meta<typeof MediaVideo> = {
  title: "Components/MediaVideo",
  component: MediaVideo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A video component with aspect ratio control, shapes, sizes, controls, autoplay, poster support, and error state.",
      },
    },
  },
  args: {
    src: SAMPLE_VIDEO,
    ratio: "16:9",
    size: "sm",
    shape: "rounded",
    controls: true,
    preload: "metadata",
    autoPlay: false,
    muted: false,
    loop: false,
    hideCaption: false,
  },
  argTypes: {
    ratio: { control: "select", options: ["1:1", "16:9", "4:3", "1:2", "free"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    preload: { control: "select", options: ["none", "metadata", "auto"] },
    controls: { control: "boolean" },
    autoPlay: { control: "boolean" },
    muted: { control: "boolean" },
    loop: { control: "boolean" },
    hideCaption: { control: "boolean" },
    caption: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof MediaVideo>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: MediaVideoProps) => (
    <div className="w-120">
      <MediaVideo {...args} />
    </div>
  ),
};

// ── With Caption ─────────────────────────────

export const WithCaption: Story = {
  render: (args: MediaVideoProps) => (
    <div className="w-120">
      <MediaVideo {...args} caption="Big Buck Bunny - sample video clip" />
    </div>
  ),
};

// ── With Poster ──────────────────────────────

export const WithPoster: Story = {
  render: (args: MediaVideoProps) => (
    <div className="w-120">
      <MediaVideo {...args} poster={SAMPLE_POSTER} caption="Video with poster image" />
    </div>
  ),
};

// ── Ratios ───────────────────────────────────

export const Ratios: Story = {
  render: (args: MediaVideoProps) => (
    <div className="flex gap-4 flex-wrap">
      {(["16:9", "4:3", "1:1"] as const).map((ratio) => (
        <div key={ratio} className="w-70">
          <MediaVideo {...args} ratio={ratio} caption={ratio} />
        </div>
      ))}
    </div>
  ),
};

// ── Shapes ───────────────────────────────────

export const Shapes: Story = {
  render: (args: MediaVideoProps) => (
    <div className="flex gap-4 items-start">
      {(["square", "rounded"] as const).map((shape) => (
        <div key={shape} className="w-70">
          <MediaVideo {...args} shape={shape} caption={shape} />
        </div>
      ))}
    </div>
  ),
};

// ── Autoplay Muted Loop ──────────────────────

export const AutoplayMutedLoop: Story = {
  render: (args: MediaVideoProps) => (
    <div className="w-120">
      <MediaVideo {...args} autoPlay muted loop controls={false} caption="Autoplay, muted, looping" />
    </div>
  ),
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  render: (args: MediaVideoProps) => (
    <div className="w-120">
      <MediaVideo {...args} src="" caption="This video failed to load" />
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: MediaVideoProps) => (
    <div className="flex flex-col gap-4 w-120">
      {(["xs", "sm", "md"] as const).map((size) => (
        <MediaVideo key={size} {...args} size={size} caption={`Size: ${size}`} />
      ))}
    </div>
  ),
};
