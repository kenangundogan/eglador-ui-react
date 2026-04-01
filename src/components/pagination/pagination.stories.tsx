import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination, type PaginationProps } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A pagination component with page numbers, prev/next arrows, first/last buttons, ellipsis for large ranges, 3 sizes, 3 variants, configurable sibling and boundary counts.",
      },
    },
  },
  args: {
    totalPages: 20,
    size: "sm",
    variant: "default",
    siblingCount: 1,
    boundaryCount: 1,
    showPrevNext: true,
    showFirstLast: false,
    disabled: false,
  },
  argTypes: {
    totalPages: { control: { type: "number", min: 1, max: 100 } },
    size: { control: "select", options: ["xs", "sm", "md"] },
    variant: { control: "select", options: ["default", "outline", "ghost"] },
    siblingCount: { control: { type: "number", min: 0, max: 3 } },
    boundaryCount: { control: { type: "number", min: 0, max: 3 } },
    showPrevNext: { control: "boolean" },
    showFirstLast: { control: "boolean" },
    disabled: { control: "boolean" },
    onPageChange: { action: "pageChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(1);
    return (
      <div className="flex flex-col gap-2">
        <Pagination {...args} currentPage={page} onPageChange={setPage} />
        <span className="text-xs text-zinc-400">Page {page} of {args.totalPages}</span>
      </div>
    );
  },
};

// ── Variants ─────────────────────────────────

export const Variants: Story = {
  render: () => {
    const [pages, setPages] = useState({ default: 5, outline: 5, ghost: 5 });
    return (
      <div className="flex flex-col gap-4">
        {(["default", "outline", "ghost"] as const).map((variant) => (
          <div key={variant}>
            <span className="text-xs text-zinc-400 mb-2 block">{variant}</span>
            <Pagination
              totalPages={20}
              variant={variant}
              currentPage={pages[variant]}
              onPageChange={(p) => setPages((prev) => ({ ...prev, [variant]: p }))}
            />
          </div>
        ))}
      </div>
    );
  },
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size}>
          <span className="text-xs text-zinc-400 mb-2 block">{size}</span>
          <Pagination totalPages={10} defaultPage={5} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── With First/Last ──────────────────────────

export const WithFirstLast: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(10);
    return (
      <Pagination {...args} currentPage={page} onPageChange={setPage} showFirstLast />
    );
  },
};

// ── Few Pages ────────────────────────────────

export const FewPages: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(1);
    return (
      <Pagination {...args} totalPages={5} currentPage={page} onPageChange={setPage} />
    );
  },
};

// ── Many Pages ───────────────────────────────

export const ManyPages: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(50);
    return (
      <Pagination {...args} totalPages={100} currentPage={page} onPageChange={setPage} showFirstLast />
    );
  },
};

// ── More Siblings ────────────────────────────

export const MoreSiblings: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(10);
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-400">siblingCount: 2, boundaryCount: 2</span>
        <Pagination {...args} totalPages={30} currentPage={page} onPageChange={setPage} siblingCount={2} boundaryCount={2} />
      </div>
    );
  },
};

// ── No Arrows ────────────────────────────────

export const NoArrows: Story = {
  render: (args: PaginationProps) => {
    const [page, setPage] = useState(5);
    return (
      <Pagination {...args} totalPages={10} currentPage={page} onPageChange={setPage} showPrevNext={false} />
    );
  },
};

// ── Disabled ─────────────────────────────────

export const Disabled: Story = {
  render: (args: PaginationProps) => (
    <Pagination {...args} totalPages={20} defaultPage={7} disabled />
  ),
};

// ── Table Integration ────────────────────────

export const TableIntegration: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalItems = 87;
    const perPage = 10;
    const totalPages = Math.ceil(totalItems / perPage);
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, totalItems);

    return (
      <div className="flex flex-col gap-3 w-120">
        <div className="border border-zinc-200 rounded-lg p-4">
          <p className="text-sm text-zinc-600">Showing items {start}-{end} of {totalItems}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">{totalItems} total results</span>
          <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} size="xs" />
        </div>
      </div>
    );
  },
};
