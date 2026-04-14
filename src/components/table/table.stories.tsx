import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type TableProps } from "./table";
import { Badge } from "../badge";

const sampleData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active" },
  { id: 5, name: "Edward Norton", email: "edward@example.com", role: "Editor", status: "Inactive" },
];

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compound table component with default, bordered, and striped variants. Supports clickable rows, sticky header, scroll, and column alignment.",
      },
    },
  },
  args: {
    size: "sm",
    variant: "default",
    shape: "rounded",
    fullWidth: true,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md"] },
    variant: { control: "select", options: ["default", "bordered", "striped"] },
    shape: { control: "select", options: ["square", "rounded"] },
    fullWidth: { control: "boolean" },
    scrollX: { control: "boolean" },
    scrollY: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: (args: TableProps) => (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
          <Table.Header align="center">Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sampleData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell align="center">
              {row.status === "Active" ? (
                <Badge size="xs" color="success" shape="pill">Active</Badge>
              ) : (
                <Badge size="xs" shape="pill">Inactive</Badge>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Bordered ─────────────────────────────────

export const Bordered: Story = {
  args: { variant: "bordered" },
  render: (args: TableProps) => (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sampleData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Striped ──────────────────────────────────

export const Striped: Story = {
  args: { variant: "striped" },
  render: (args: TableProps) => (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sampleData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Sizes ────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size}>
          <span className="text-xs text-zinc-400 mb-2 block">size: {size}</span>
          <Table size={size} variant="bordered">
            <Table.Head>
              <Table.Row>
                <Table.Header>Name</Table.Header>
                <Table.Header>Role</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row><Table.Cell>Alice</Table.Cell><Table.Cell>Admin</Table.Cell></Table.Row>
              <Table.Row><Table.Cell>Bob</Table.Cell><Table.Cell>Editor</Table.Cell></Table.Row>
            </Table.Body>
          </Table>
        </div>
      ))}
    </div>
  ),
};

// ── Clickable Rows ───────────────────────────

export const ClickableRows: Story = {
  render: (args: TableProps) => (
    <Table {...args} variant="bordered">
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sampleData.map((row) => (
          <Table.Row key={row.id} onClick={() => alert(`Clicked: ${row.name}`)}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Active Row ───────────────────────────────

export const ActiveRow: Story = {
  render: (args: TableProps) => (
    <Table {...args} variant="bordered">
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Role</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sampleData.map((row) => (
          <Table.Row key={row.id} isActive={row.id === 2}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Truncate ─────────────────────────────────

export const Truncate: Story = {
  render: (args: TableProps) => (
    <div className="max-w-md">
      <Table {...args} variant="bordered">
        <Table.Head>
          <Table.Row>
            <Table.Header width="120px">Name</Table.Header>
            <Table.Header>Description</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
            <Table.Cell truncate>This is a very long description text that should be truncated when it overflows the cell width</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Bob</Table.Cell>
            <Table.Cell truncate>Another long text that demonstrates the truncate feature in table cells</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

// ── Scroll X ─────────────────────────────────

export const ScrollX: Story = {
  render: (args: TableProps) => (
    <div className="md:max-w-1/2">
    <Table {...args} variant="bordered" scrollX >
      <Table.Head>
        <Table.Row>
          <Table.Header>ID</Table.Header>
          <Table.Header>Name</Table.Header>
          <Table.Header>User Name</Table.Header>
          <Table.Header>Phone</Table.Header>
          <Table.Header>Email</Table.Header>
          <Table.Header>Address</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Array.from({ length: 3 }, (_, i) => (
          <Table.Row key={i}>
            <Table.Cell>{i + 1}</Table.Cell>
            <Table.Cell>User {i + 1}</Table.Cell>
            <Table.Cell>user-name-{i + 1}</Table.Cell>
            <Table.Cell>(55{i + 1}) 113 52 77</Table.Cell>
            <Table.Cell>user{i + 1}@example.com</Table.Cell>
            <Table.Cell>Beyoğlu/Taksim - İstanbul </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </div>
  ),
};

// ── Scroll Y ─────────────────────────────────

export const ScrollY: Story = {
  render: (args: TableProps) => (
    <Table {...args} variant="bordered" scrollY maxHeight="200px">
      <Table.Head>
        <Table.Row>
          <Table.Header>ID</Table.Header>
          <Table.Header>Name</Table.Header>
          <Table.Header>Email</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Array.from({ length: 20 }, (_, i) => (
          <Table.Row key={i}>
            <Table.Cell>{i + 1}</Table.Cell>
            <Table.Cell>User {i + 1}</Table.Cell>
            <Table.Cell>user{i + 1}@example.com</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

// ── Column Alignment ─────────────────────────

export const ColumnAlignment: Story = {
  render: (args: TableProps) => (
    <Table {...args} variant="bordered">
      <Table.Head>
        <Table.Row>
          <Table.Header>Product</Table.Header>
          <Table.Header align="center">Qty</Table.Header>
          <Table.Header align="right">Price</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row><Table.Cell>Widget A</Table.Cell><Table.Cell align="center">12</Table.Cell><Table.Cell align="right">$24.99</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Widget B</Table.Cell><Table.Cell align="center">5</Table.Cell><Table.Cell align="right">$149.00</Table.Cell></Table.Row>
        <Table.Row><Table.Cell>Widget C</Table.Cell><Table.Cell align="center">38</Table.Cell><Table.Cell align="right">$7.50</Table.Cell></Table.Row>
      </Table.Body>
    </Table>
  ),
};
