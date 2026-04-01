import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, LayoutGrid, Users, Settings, FileText, Mail, Bell, Search, ChevronDown, LogOut, CreditCard, BarChart, Folder, Star, ChevronUp, User, Shield } from "lucide-react";
import { Sidebar, SidebarProvider, SidebarInset, useSidebar } from "./sidebar";
import { Badge } from "../badge";
import { Avatar } from "../avatar";
import { Input } from "../input";
import { Popover } from "../popover";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A full-featured sidebar layout component with collapsible state, icon-only mode, menu groups, collapsible sub-menus, tenant switcher header, user profile dropdown footer, trigger, and rail.",
      },
    },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// ── Helper: TenantSwitcher ───────────────────

function TenantSwitcher() {
  const { isOpen } = useSidebar();
  const [tenant, setTenant] = useState("Eglador");
  const tenants = ["Eglador", "Acme Corp", "Stark Industries"];

  return (
    <Popover side="bottom" align="start">
      <Popover.Trigger asChild>
        <button type="button" className="flex w-full items-center gap-2 rounded-lg hover:bg-zinc-50 p-1 transition-colors cursor-pointer">
          <div className="size-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {tenant[0]}
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-zinc-900 truncate">{tenant}</p>
                <p className="text-[10px] text-zinc-400 truncate">Free Plan</p>
              </div>
              <ChevronDown className="size-3.5 text-zinc-400 shrink-0" />
            </>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-56 p-1.5">
        <p className="px-2 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Switch Workspace</p>
        {tenants.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTenant(t)}
            className={`flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${tenant === t ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-600 hover:bg-zinc-50"}`}
          >
            <div className="size-5 rounded bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
              {t[0]}
            </div>
            {t}
          </button>
        ))}
      </Popover.Content>
    </Popover>
  );
}

// ── Helper: UserMenu ─────────────────────────

function UserMenu() {
  const { isOpen } = useSidebar();

  return (
    <Popover side="top" align="start">
      <Popover.Trigger asChild>
        <button type="button" className="flex w-full items-center gap-2 rounded-lg hover:bg-zinc-50 p-1 transition-colors cursor-pointer">
          <Avatar name="Kenan Gundogan" size="sm" />
          {isOpen && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-zinc-900 truncate">Kenan Gundogan</p>
                <p className="text-[10px] text-zinc-400 truncate">kenan@eglador.com</p>
              </div>
              <ChevronUp className="size-3.5 text-zinc-400 shrink-0" />
            </>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-56 p-1.5">
        <div className="px-2 py-2 border-b border-zinc-100 mb-1">
          <p className="text-sm font-semibold text-zinc-900">Kenan Gundogan</p>
          <p className="text-xs text-zinc-400">kenan@eglador.com</p>
        </div>
        <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-zinc-600 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer">
          <User className="size-4 opacity-60" /> Profile
        </button>
        <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-zinc-600 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer">
          <CreditCard className="size-4 opacity-60" /> Billing
        </button>
        <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-zinc-600 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer">
          <Shield className="size-4 opacity-60" /> Security
        </button>
        <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-zinc-600 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer">
          <Settings className="size-4 opacity-60" /> Settings
        </button>
        <div className="border-t border-zinc-100 mt-1 pt-1">
          <button type="button" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer">
            <LogOut className="size-4 opacity-60" /> Sign Out
          </button>
        </div>
      </Popover.Content>
    </Popover>
  );
}

// ── Helper: RightPanelHeader ─────────────────

function RightPanelHeader() {
  const { isOpen } = useSidebar();
  return (
    <div className="flex items-center gap-2">
      <div className="size-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
        <Settings className="size-3.5 text-zinc-500" />
      </div>
      {isOpen && <span className="text-sm font-semibold text-zinc-900 truncate">Properties</span>}
    </div>
  );
}

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <Sidebar.Header>
          <TenantSwitcher />
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Home />} active tooltip="Dashboard">Dashboard</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<LayoutGrid />} tooltip="Projects">Projects</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Users />} tooltip="Team">Team</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<FileText />} tooltip="Documents">Documents</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<BarChart />} tooltip="Analytics">Analytics</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Group>
            <Sidebar.GroupLabel>Communication</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Mail />} badge={<Badge size="xs" shape="pill">3</Badge>} tooltip="Messages">
                    Messages
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Bell />} badge={<Badge size="xs" shape="pill">12</Badge>} tooltip="Notifications">
                    Notifications
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <UserMenu />
        </Sidebar.Footer>
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Sidebar.Trigger />
          <span className="text-sm font-medium text-zinc-900">Dashboard</span>
        </div>
        <div className="p-6 text-sm text-zinc-400">Main content area</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// ── With Sub Menus ───────────────────────────

export const WithSubMenus: Story = {
  render: () => {
    const [activeItem, setActiveItem] = useState("overview");
    return (
      <SidebarProvider>
        <Sidebar>
          <Sidebar.Header>
            <TenantSwitcher />
          </Sidebar.Header>

          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={<Home />} active={activeItem === "overview"} onClick={() => setActiveItem("overview")} tooltip="Overview">
                      Overview
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem defaultOpen>
                    <Sidebar.MenuButton icon={<LayoutGrid />} active={activeItem.startsWith("project")} tooltip="Projects">
                      Projects
                    </Sidebar.MenuButton>
                    <Sidebar.MenuSub>
                      <Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton active={activeItem === "project-all"} onClick={() => setActiveItem("project-all")}>All Projects</Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                      <Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton active={activeItem === "project-active"} onClick={() => setActiveItem("project-active")}>Active</Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                      <Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton active={activeItem === "project-archived"} onClick={() => setActiveItem("project-archived")}>Archived</Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                    </Sidebar.MenuSub>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={<Users />} active={activeItem.startsWith("team")} tooltip="Team">
                      Team
                    </Sidebar.MenuButton>
                    <Sidebar.MenuSub>
                      <Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton active={activeItem === "team-members"} onClick={() => setActiveItem("team-members")}>Members</Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                      <Sidebar.MenuSubItem>
                        <Sidebar.MenuSubButton active={activeItem === "team-roles"} onClick={() => setActiveItem("team-roles")}>Roles</Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                    </Sidebar.MenuSub>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={<BarChart />} active={activeItem === "analytics"} onClick={() => setActiveItem("analytics")} tooltip="Analytics">
                      Analytics
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>

          <Sidebar.Footer>
            <UserMenu />
          </Sidebar.Footer>
        </Sidebar>

        <SidebarInset>
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
            <Sidebar.Trigger />
            <span className="text-sm font-medium text-zinc-900 capitalize">{activeItem.replace("-", " → ")}</span>
          </div>
          <div className="p-6 text-sm text-zinc-400">Content for: {activeItem}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  },
};

// ── Right Side ───────────────────────────────

export const RightSide: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <span className="text-sm font-medium text-zinc-900">Main Content</span>
          <div className="ml-auto">
            <Sidebar.Trigger />
          </div>
        </div>
        <div className="p-6 text-sm text-zinc-400">Page content here</div>
      </SidebarInset>

      <Sidebar side="right">
        <Sidebar.Header>
          <RightPanelHeader />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Details</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<FileText />} tooltip="Info">General Info</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Settings />} tooltip="Settings">Settings</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Star />} tooltip="Favorites">Favorites</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
    </SidebarProvider>
  ),
};

// ── Collapsed by Default ─────────────────────

export const CollapsedByDefault: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <Sidebar.Header>
          <TenantSwitcher />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Home />} active tooltip="Dashboard">Dashboard</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<LayoutGrid />} tooltip="Projects">Projects</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Users />} tooltip="Team">Team</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Mail />} tooltip="Messages">Messages</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Settings />} tooltip="Settings">Settings</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <UserMenu />
        </Sidebar.Footer>
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Sidebar.Trigger />
          <span className="text-sm font-medium text-zinc-900">Dashboard</span>
        </div>
        <div className="p-6 text-sm text-zinc-400">Toggle the sidebar to expand it.</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// ── With Search ──────────────────────────────

export const WithSearch: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <Sidebar.Header>
          <TenantSwitcher />
          <Input size="xs" icon={<Search />} placeholder="Search..." />
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Favorites</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {["Homepage", "Dashboard", "Settings"].map((item) => (
                  <Sidebar.MenuItem key={item}>
                    <Sidebar.MenuButton icon={<Star />}>{item}</Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Group>
            <Sidebar.GroupLabel>Folders</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {["Documents", "Images", "Downloads", "Archive"].map((item) => (
                  <Sidebar.MenuItem key={item}>
                    <Sidebar.MenuButton icon={<Folder />}>{item}</Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <UserMenu />
        </Sidebar.Footer>
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Sidebar.Trigger />
          <span className="text-sm font-medium text-zinc-900">Content</span>
        </div>
        <div className="p-6 text-sm text-zinc-400">Main content area</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// ── Inset Variant ────────────────────────────

export const InsetVariant: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="inset">
        <Sidebar.Header>
          <TenantSwitcher />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Home />} active tooltip="Home">Home</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<LayoutGrid />} tooltip="Browse">Browse</Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton icon={<Bell />} tooltip="Activity">Activity</Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <UserMenu />
        </Sidebar.Footer>
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Sidebar.Trigger />
          <span className="text-sm font-medium text-zinc-900">Home</span>
        </div>
        <div className="p-6 text-sm text-zinc-400">Inset variant has a subtle background difference.</div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
