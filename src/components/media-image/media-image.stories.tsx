import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaImage, type MediaImageProps } from "./media-image";

const SAMPLE_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80";

const meta: Meta<typeof MediaImage> = {
  title: "Components/MediaImage",
  component: MediaImage,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An image component with aspect ratio control, multiple shapes, sizes, object-fit options, error state, and caption support.",
      },
    },
  },
  args: {
    src: SAMPLE_IMAGE,
    alt: "Sample landscape",
    ratio: "16:9",
    size: "sm",
    shape: "rounded",
    objectFit: "cover",
    loading: "lazy",
    hideCaption: false,
  },
  argTypes: {
    ratio: { control: "select", options: ["1:1", "16:9", "4:3", "1:2", "free"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    objectFit: { control: "select", options: ["cover", "contain", "fill", "none"] },
    loading: { control: "select", options: ["lazy", "eager"] },
    hideCaption: { control: "boolean" },
    caption: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof MediaImage>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: MediaImageProps) => (
    <div className="w-100">
      <MediaImage {...args} />
    </div>
  ),
};

// ── Ratios ───────────────────────────────────

export const Ratios: Story = {
  render: (args: MediaImageProps) => (
    <div className="flex gap-4 flex-wrap">
      {(["1:1", "16:9", "4:3"] as const).map((ratio) => (
        <div key={ratio} className="w-50">
          <MediaImage {...args} ratio={ratio} caption={ratio} />
        </div>
      ))}
    </div>
  ),
};

// ── Shapes ───────────────────────────────────

export const Shapes: Story = {
  render: (args: MediaImageProps) => (
    <div className="flex gap-4 items-start">
      <div className="w-40">
        <MediaImage {...args} shape="square" ratio="1:1" caption="Square" />
      </div>
      <div className="w-40">
        <MediaImage {...args} shape="rounded" ratio="1:1" caption="Rounded" />
      </div>
      <div className="w-40">
        <MediaImage {...args} shape="circle" ratio="1:1" caption="Circle" />
      </div>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: (args: MediaImageProps) => (
    <div className="flex flex-col gap-4 w-100">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <MediaImage key={size} {...args} size={size} caption={`Size: ${size}`} />
      ))}
    </div>
  ),
};

// ── With Caption ─────────────────────────────

export const WithCaption: Story = {
  render: (args: MediaImageProps) => (
    <div className="w-100">
      <MediaImage {...args} caption="A beautiful mountain landscape at sunset with warm golden light." />
    </div>
  ),
};

// ── Error State ──────────────────────────────

export const ErrorState: Story = {
  render: (args: MediaImageProps) => (
    <div className="w-100">
      <MediaImage {...args} src="" alt="Broken image" caption="This image failed to load" />
    </div>
  ),
};

// ── Object Fit ───────────────────────────────

export const ObjectFit: Story = {
  render: (args: MediaImageProps) => (
    <div className="flex gap-4 flex-wrap">
      {(["cover", "contain", "fill", "none"] as const).map((fit) => (
        <div key={fit} className="w-50">
          <MediaImage {...args} objectFit={fit} ratio="1:1" caption={fit} />
        </div>
      ))}
    </div>
  ),
};
