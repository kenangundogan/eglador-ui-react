import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { Avatar } from "../avatar";
import { DataTable, type DataTableColumn } from "./data-table";

// ── Sample Data ──────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  joinDate: string;
}

const users: User[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Edward Norton", "Fiona Apple", "George Lucas", "Hannah Montana", "Ivan Drago", "Julia Roberts"][i % 10],
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer", "Manager", "Developer"][i % 5],
  status: i % 4 === 0 ? "Inactive" : "Active",
  department: ["Engineering", "Design", "Marketing", "Sales", "Support"][i % 5],
  joinDate: new Date(2023, i % 12, (i % 28) + 1).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
}));

const userColumns: DataTableColumn<User>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    cell: (value) => (
      <div className="flex items-center gap-2">
        <Avatar name={String(value)} size="xs" color="primary" />
        <span className="font-medium text-zinc-900">{String(value)}</span>
      </div>
    ),
  },
  { id: "email", header: "Email", accessorKey: "email" },
  { id: "role", header: "Role", accessorKey: "role" },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    align: "center",
    cell: (value) => (
      <Badge size="xs" color={value === "Active" ? "success" : "default"} shape="pill">
        {String(value)}
      </Badge>
    ),
  },
  { id: "department", header: "Department", accessorKey: "department" },
  { id: "joinDate", header: "Joined", accessorKey: "joinDate" },
];

// ── Shared action column builder ─────────────

function createActionColumn<T extends Record<string, unknown>>(labelKey: string): DataTableColumn<T>[] {
  return [{
    id: "actions",
    header: "Actions",
    sortable: false,
    filterable: false,
    hideable: false,
    align: "right" as const,
    cell: (_value: unknown, row: T) => (
      <div className="flex gap-1 justify-end">
        <button type="button" onClick={() => alert(`Edit: ${row[labelKey]}`)} className="px-2 py-1 text-xs border border-zinc-200 rounded hover:bg-zinc-50 cursor-pointer">Edit</button>
        <button type="button" onClick={() => alert(`Delete: ${row[labelKey]}`)} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 cursor-pointer">Delete</button>
      </div>
    ),
  }];
}

// ── Meta ─────────────────────────────────────

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A dynamic data table supporting both local and remote (API) data. Features: search, sorting, pagination, column visibility, row selection, includeColumns/excludeColumns, auto-column generation, custom cell rendering, and Laravel-style API pagination mapping.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md"] },
    searchable: { control: "boolean" },
    selectable: { control: "boolean" },
    showColumnToggle: { control: "boolean" },
    striped: { control: "boolean" },
    bordered: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    loading: { control: "boolean" },
    pageSize: { control: { type: "number", min: 5, max: 50 } },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// ── LOCAL MODE ───────────────────────────────

export const Default: Story = {
  render: () => (
    <DataTable data={users} columns={userColumns} rowKey="id" bordered />
  ),
};

export const FullFeatured: Story = {
  render: () => {
    const [selected, setSelected] = useState<User[]>([]);
    return (
      <DataTable
        data={users}
        columns={userColumns}
        rowKey="id"
        searchable
        searchPlaceholder="Search users..."
        selectable
        showColumnToggle
        striped
        bordered
        selectedRows={selected}
        onSelectionChange={setSelected}
        pageSizes={[5, 10, 25]}
        pageSize={10}
      />
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size}>
          <span className="text-xs text-zinc-400 mb-2 block">{size}</span>
          <DataTable data={users.slice(0, 3)} columns={userColumns.slice(0, 4)} rowKey="id" size={size} bordered />
        </div>
      ))}
    </div>
  ),
};

export const CustomCellRenderer: Story = {
  render: () => {
    const customColumns: DataTableColumn<User>[] = [
      { id: "id", header: "#", accessorKey: "id", width: "60px", align: "center" },
      {
        id: "user",
        header: "User",
        accessorFn: (row) => row.name,
        cell: (_value, row) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.name} size="xs" color={row.status === "Active" ? "success" : "default"} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900">{row.name}</span>
              <span className="text-xs text-zinc-400">{row.email}</span>
            </div>
          </div>
        ),
      },
      { id: "role", header: "Role", accessorKey: "role" },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: (value) => (
          <Badge size="xs" color={value === "Active" ? "success" : "danger"} shape="pill" variant="soft">
            {String(value)}
          </Badge>
        ),
      },
    ];
    return <DataTable data={users} columns={customColumns} rowKey="id" searchable bordered />;
  },
};

export const ColumnFilters: Story = {
  render: () => {
    const filteredColumns: DataTableColumn<User>[] = [
      { ...userColumns[0] },
      { ...userColumns[1], filterType: "text" },
      { ...userColumns[2], filterType: "select" },
      { ...userColumns[3], filterType: "select", filterOptions: ["Active", "Inactive"] },
      { ...userColumns[4], filterType: "select" },
      { ...userColumns[5], filterType: "date", filterable: false },
    ];
    return (
      <DataTable
        data={users}
        columns={filteredColumns}
        rowKey="id"
        showColumnFilters
        bordered
        pageSize={10}
      />
    );
  },
};

export const StickyHeader: Story = {
  render: () => (
    <DataTable data={users} columns={userColumns} rowKey="id" stickyHeader maxHeight="300px" bordered pageSize={50} />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <DataTable data={[]} columns={userColumns} rowKey="id" loading bordered />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <DataTable data={[]} columns={userColumns} rowKey="id" bordered emptyMessage="No users found." />
  ),
};

// ── COLUMN FILTERING ─────────────────────────

export const AutoColumns: Story = {
  render: () => (
    <DataTable data={users} rowKey="id" bordered searchable pageSize={5} />
  ),
};

export const IncludeColumns: Story = {
  render: () => (
    <DataTable data={users} rowKey="id" includeColumns={["name", "email", "status"]} bordered searchable pageSize={5} />
  ),
};

export const ExcludeColumns: Story = {
  render: () => (
    <DataTable data={users} rowKey="id" excludeColumns={["id", "joinDate", "department"]} bordered searchable pageSize={5} />
  ),
};

export const FixedColumns: Story = {
  render: () => {
    const fixedColumns: DataTableColumn<User>[] = [
      { id: "name", header: "Name", accessorKey: "name", fixed: "left", width: "180px", cell: (value) => <span className="font-medium text-zinc-900">{String(value)}</span> },
      { id: "email", header: "Email", accessorKey: "email", minWidth: "220px" },
      { id: "role", header: "Role", accessorKey: "role", minWidth: "150px" },
      { id: "status", header: "Status", accessorKey: "status", minWidth: "150px", align: "center", cell: (value) => <Badge size="xs" color={value === "Active" ? "success" : "default"} shape="pill">{String(value)}</Badge> },
      { id: "department", header: "Department", accessorKey: "department", minWidth: "180px" },
      { id: "joinDate", header: "Joined", accessorKey: "joinDate", minWidth: "160px" },
      {
        id: "actions",
        header: "Actions",
        sortable: false,
        filterable: false,
        hideable: false,
        fixed: "right",
        width: "160px",
        align: "right" as const,
        cell: (_value: unknown, row: User) => (
          <div className="flex gap-1 justify-end">
            <button type="button" onClick={() => alert(`Edit: ${row.name}`)} className="px-2 py-1 text-xs border border-zinc-200 rounded hover:bg-zinc-50 cursor-pointer">Edit</button>
            <button type="button" onClick={() => alert(`Delete: ${row.name}`)} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 cursor-pointer">Delete</button>
          </div>
        ),
      },
    ];
    return (
      <div style={{ maxWidth: 700 }}>
        <DataTable data={users} columns={fixedColumns} rowKey="id" bordered pageSize={5} />
      </div>
    );
  },
};

// ── REMOTE MODE ──────────────────────────────

export const RemoteClientPagination: Story = {
  render: () => (
    <DataTable
      endpoint="https://jsonplaceholder.typicode.com/posts"
      responseMapping={{ data: "" }}
      includeColumns={["id", "title"]}
      addColumns={createActionColumn<Record<string, unknown>>("title")}
      rowKey="id"
      searchable
      bordered
      pageSize={5}
      pageSizes={[5, 10, 20]}
    />
  ),
};

export const RemoteServerPagination: Story = {
  render: () => {
    const columns: DataTableColumn<Record<string, unknown>>[] = [
      { id: "id", header: "#", accessorKey: "id", width: "60px", align: "center" },
      {
        id: "member",
        header: "Member",
        accessorKey: "member",
        cell: (value, row) => (
          <div className="flex items-center gap-2">
            <img src={String(row.avatar)} alt="" className="size-7 rounded-full object-cover" />
            <span className="font-medium text-zinc-900">{String(value)}</span>
          </div>
        ),
      },
      { id: "location", header: "Location", accessorKey: "location" },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        align: "center",
        cell: (value) => (
          <Badge size="xs" color={value === "Active" ? "success" : "default"} shape="pill">{String(value)}</Badge>
        ),
      },
    ];

    return (
      <DataTable
        endpoint="http://localhost:3001/api/table"
        responseMapping={{ data: "data" }}
        paginationMapping={{
          currentPage: "meta.current_page",
          lastPage: "meta.last_page",
          perPage: "meta.per_page",
          total: "meta.total",
          from: "meta.from",
          to: "meta.to",
        }}
        columns={columns}
        addColumns={createActionColumn<Record<string, unknown>>("member")}
        rowKey="id"
        searchable
        selectable
        showColumnToggle
        bordered
      />
    );
  },
};
