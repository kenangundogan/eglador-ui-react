import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calculator, Calendar, CreditCard, Settings, User, Mail, Search, FileText, Home, LayoutGrid, Moon, Sun, LogOut, HelpCircle, Bell, Palette } from "lucide-react";
import { Button } from "../button";
import { Kbd } from "../kbd";
import { Command } from "./command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A command palette for search and quick actions. Opens with ⌘K / Ctrl+K. Supports search filtering, groups, keyboard navigation (Arrow keys + Enter), shortcuts display, and empty state.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

// ── Default ──────────────────────────────────

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <span className="flex items-center gap-2">
            <Search className="size-4" />
            Search...
            <Kbd size="xs" keys={["⌘", "K"]} />
          </span>
        </Button>
        <span className="text-xs text-zinc-400">Or press ⌘K / Ctrl+K</span>

        <Command open={open} onOpenChange={setOpen}>
          <Command.Input placeholder="Type a command or search..." />
          <Command.List>
            <Command.Empty />
            <Command.Group heading="Suggestions">
              <Command.Item icon={<Calendar />} onSelect={() => alert("Calendar")}>Calendar</Command.Item>
              <Command.Item icon={<Search />} onSelect={() => alert("Search")}>Search</Command.Item>
              <Command.Item icon={<Calculator />} onSelect={() => alert("Calculator")}>Calculator</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Settings">
              <Command.Item icon={<User />} shortcut="⌘P" onSelect={() => alert("Profile")}>Profile</Command.Item>
              <Command.Item icon={<CreditCard />} shortcut="⌘B" onSelect={() => alert("Billing")}>Billing</Command.Item>
              <Command.Item icon={<Settings />} shortcut="⌘S" onSelect={() => alert("Settings")}>Settings</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    );
  },
};

// ── Application Launcher ─────────────────────

export const ApplicationLauncher: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Button color="primary" onClick={() => setOpen(true)}>Open Command Menu</Button>

        <Command open={open} onOpenChange={setOpen}>
          <Command.Input placeholder="What do you need?" />
          <Command.List>
            <Command.Empty>No results found. Try a different search.</Command.Empty>
            <Command.Group heading="Navigation">
              <Command.Item icon={<Home />} keywords={["dashboard", "main"]} onSelect={() => setOpen(false)}>Go to Dashboard</Command.Item>
              <Command.Item icon={<LayoutGrid />} keywords={["project", "work"]} onSelect={() => setOpen(false)}>Go to Projects</Command.Item>
              <Command.Item icon={<Mail />} keywords={["message", "inbox"]} onSelect={() => setOpen(false)}>Go to Messages</Command.Item>
              <Command.Item icon={<Bell />} keywords={["notification", "alert"]} onSelect={() => setOpen(false)}>Go to Notifications</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Actions">
              <Command.Item icon={<FileText />} shortcut="⌘N" keywords={["new", "create"]} onSelect={() => alert("New Document")}>New Document</Command.Item>
              <Command.Item icon={<User />} keywords={["invite", "add"]} onSelect={() => alert("Invite")}>Invite Team Member</Command.Item>
              <Command.Item icon={<Palette />} keywords={["theme", "appearance"]} onSelect={() => alert("Theme")}>Change Theme</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Quick Settings">
              <Command.Item icon={<Moon />} keywords={["dark", "night"]} onSelect={() => alert("Dark mode")}>Toggle Dark Mode</Command.Item>
              <Command.Item icon={<Sun />} keywords={["light", "bright"]} onSelect={() => alert("Light mode")}>Toggle Light Mode</Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Account">
              <Command.Item icon={<Settings />} shortcut="⌘," onSelect={() => alert("Settings")}>Settings</Command.Item>
              <Command.Item icon={<HelpCircle />} onSelect={() => alert("Help")}>Help & Support</Command.Item>
              <Command.Item icon={<LogOut />} onSelect={() => alert("Logout")}>Sign Out</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    );
  },
};

// ── With Disabled Items ──────────────────────

export const WithDisabledItems: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Button variant="outline" onClick={() => setOpen(true)}>Open Command</Button>

        <Command open={open} onOpenChange={setOpen}>
          <Command.Input />
          <Command.List>
            <Command.Empty />
            <Command.Group heading="Actions">
              <Command.Item icon={<FileText />} onSelect={() => alert("New")}>New File</Command.Item>
              <Command.Item icon={<Search />} onSelect={() => alert("Search")}>Search Files</Command.Item>
              <Command.Item icon={<Settings />} disabled>Admin Settings (no access)</Command.Item>
              <Command.Item icon={<CreditCard />} disabled>Billing (upgrade required)</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    );
  },
};

// ── Search Only ──────────────────────────────

export const SearchOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const pages = [
      { title: "Getting Started", keywords: ["intro", "setup", "install"] },
      { title: "Components", keywords: ["ui", "button", "input"] },
      { title: "API Reference", keywords: ["docs", "api", "props"] },
      { title: "Changelog", keywords: ["updates", "version", "release"] },
      { title: "Contributing", keywords: ["github", "pr", "open source"] },
      { title: "FAQ", keywords: ["questions", "help", "support"] },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <span className="flex items-center gap-2">
            <Search className="size-4" />
            Search documentation...
          </span>
        </Button>

        <Command open={open} onOpenChange={setOpen}>
          <Command.Input placeholder="Search documentation..." />
          <Command.List>
            <Command.Empty>No matching pages found.</Command.Empty>
            <Command.Group heading="Pages">
              {pages.map((page) => (
                <Command.Item key={page.title} icon={<FileText />} keywords={page.keywords} onSelect={() => { alert(`Navigate to: ${page.title}`); setOpen(false); }}>
                  {page.title}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    );
  },
};
