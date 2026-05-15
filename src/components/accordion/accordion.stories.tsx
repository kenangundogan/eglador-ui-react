import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon, WarningIcon, SuccessIcon } from "../../lib/icons";
import { Accordion, type AccordionProps } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A collapsible accordion component with default, bordered, and filled variants. Supports icon, extra content, and animated toggle.",
      },
    },
  },
  args: {
    variant: "default",
    size: "sm",
    defaultOpen: true,
    disabled: false,
    hideChevron: false,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "bordered", "filled"] },
    size: { control: "select", options: ["xs", "sm", "md"] },
    shape: { control: "select", options: ["square", "rounded"] },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    hideChevron: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ── Default ──────────────────────────────────

const faqItems = [
  {
    title: "Kargo seçenekleriniz nelerdir?",
    content:
      "Standart kargo (5-7 iş günü), ekspres kargo (2-3 iş günü) ve ertesi gün teslimat seçenekleri sunuyoruz. 500 TL üzeri siparişlerde standart kargo ücretsizdir.",
  },
  {
    title: "İade politikanız nedir?",
    content:
      "Satın aldığınız tarihten itibaren 30 gün içinde kullanılmamış ürünleri tam iade garantisiyle geri gönderebilirsiniz. Ürünlerin orijinal ambalajında olması gerekmektedir. İade başlatmak için destek ekibimizle iletişime geçiniz.",
  },
  {
    title: "Müşteri desteğine nasıl ulaşabilirim?",
    content:
      "Destek ekibimize destek@ornek.com e-posta adresi, (212) 555 12 34 numaralı telefon veya canlı sohbet özelliği aracılığıyla ulaşabilirsiniz. Çalışma saatlerimiz Pazartesi-Cuma 09:00-18:00 (TSİ) arasındadır.",
  },
  {
    title: "Yurt dışına kargo yapıyor musunuz?",
    content:
      "Evet, 50'den fazla ülkeye kargo gönderimi yapıyoruz. Uluslararası kargo ücretleri ve teslimat süreleri varış noktasına göre değişmektedir. Gümrük vergisi ve harçlar uygulanabilir.",
  },
  {
    title: "Siparişimi nasıl takip edebilirim?",
    content:
      "Siparişiniz kargoya verildiğinde size bir takip numarası içeren e-posta gönderilecektir. Bu numarayı web sitemiz veya kargo firmasının sitesi üzerinden kullanarak paketinizi anlık olarak takip edebilirsiniz.",
  },
];

export const Default: Story = {
  render: (args: AccordionProps) => (
    <div className="max-w-md flex flex-col gap-2">
      {faqItems.map((item, i) => (
        <Accordion
          key={item.title}
          {...args}
          title={item.title}
          defaultOpen={i === 0}
        >
          <div className="text-sm text-zinc-600 leading-relaxed pb-2">
            {item.content}
          </div>
        </Accordion>
      ))}
    </div>
  ),
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Accordion variant="default" title="Default">
        <div className="text-sm text-zinc-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </Accordion>
      <Accordion variant="bordered" title="Bordered">
        <div className="text-sm text-zinc-600 leading-relaxed">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </div>
      </Accordion>
      <Accordion variant="filled" title="Filled">
        <div className="text-sm text-zinc-600 leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </div>
      </Accordion>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Accordion variant="bordered" size="xs" title="Extra Small">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
      <Accordion variant="bordered" size="sm" title="Small">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
      <Accordion variant="bordered" size="md" title="Medium">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
    </div>
  ),
};

// ── With Icon ────────────────────────────────

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Accordion
        variant="bordered"
        title="Success"
        icon={<SuccessIcon className="size-4" />}
      >
        <div className="text-sm text-zinc-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </Accordion>
      <Accordion
        variant="bordered"
        title="Information"
        icon={<InfoIcon className="size-4" />}
      >
        <div className="text-sm text-zinc-600 leading-relaxed">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </div>
      </Accordion>
      <Accordion
        variant="bordered"
        title="Warning"
        icon={<WarningIcon className="size-4" />}
      >
        <div className="text-sm text-zinc-600 leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </div>
      </Accordion>
    </div>
  ),
};

// ── Multiple (FAQ style) ─────────────────────

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-md">
      {["What is this?", "How does it work?", "Is it free?"].map((q, i) => (
        <Accordion key={q} variant="bordered" title={q} defaultOpen={i === 0}>
          <div className="text-sm text-zinc-600">
            This is the answer to "{q}". It provides detailed information about
            the topic.
          </div>
        </Accordion>
      ))}
    </div>
  ),
};

// ── Controlled ───────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex flex-col gap-2 max-w-md">
        <span className="text-xs text-zinc-400">
          State: {open ? "open" : "closed"}
        </span>
        <Accordion
          variant="bordered"
          title="Controlled"
          open={open}
          onOpenChange={setOpen}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Accordion>
      </div>
    );
  },
};

// ── Shapes ──────────────────────────────────

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <Accordion variant="bordered" shape="rounded" title="Rounded (default)">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
      <Accordion variant="bordered" shape="square" title="Square">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
      <Accordion variant="filled" shape="rounded" title="Filled Rounded">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
      <Accordion variant="filled" shape="square" title="Filled Square">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
    </div>
  ),
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <Accordion variant="bordered" title="Disabled Section" disabled>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Accordion>
    </div>
  ),
};
