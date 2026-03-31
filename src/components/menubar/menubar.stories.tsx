import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Undo, Redo, Scissors, Copy, Clipboard, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Sun, Moon, Monitor, ZoomIn, ZoomOut, Maximize, FileText, FolderOpen, Save, Printer, Share } from "lucide-react";
import { Menubar } from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "Components/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A horizontal menu bar with dropdown menus, similar to desktop application menu bars. Supports items with icons and shortcuts, checkbox/radio items, sub-menus, separators, labels, and hover-mode switching between menus.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menubar>;

// ── Default (Text Editor) ────────────────────

export const Default: Story = {
  render: () => {
    const [wordWrap, setWordWrap] = useState(true);
    const [minimap, setMinimap] = useState(false);
    const [theme, setTheme] = useState("system");

    return (
      <div style={{ padding: "20px 20px 250px" }}>
        <Menubar>
          <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item icon={<FileText />} shortcut="⌘N">New File</Menubar.Item>
              <Menubar.Item icon={<FolderOpen />} shortcut="⌘O">Open</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item icon={<Save />} shortcut="⌘S">Save</Menubar.Item>
              <Menubar.Item shortcut="⌘⇧S">Save As...</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item icon={<Printer />} shortcut="⌘P">Print</Menubar.Item>
              <Menubar.Item icon={<Share />}>Share</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item icon={<Undo />} shortcut="⌘Z">Undo</Menubar.Item>
              <Menubar.Item icon={<Redo />} shortcut="⌘⇧Z">Redo</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item icon={<Scissors />} shortcut="⌘X">Cut</Menubar.Item>
              <Menubar.Item icon={<Copy />} shortcut="⌘C">Copy</Menubar.Item>
              <Menubar.Item icon={<Clipboard />} shortcut="⌘V">Paste</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item shortcut="⌘A">Select All</Menubar.Item>
              <Menubar.Item shortcut="⌘F">Find</Menubar.Item>
              <Menubar.Item shortcut="⌘H">Replace</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.CheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
                Word Wrap
              </Menubar.CheckboxItem>
              <Menubar.CheckboxItem checked={minimap} onCheckedChange={setMinimap}>
                Minimap
              </Menubar.CheckboxItem>
              <Menubar.Separator />
              <Menubar.Label>Appearance</Menubar.Label>
              <Menubar.RadioGroup value={theme} onValueChange={setTheme}>
                <Menubar.RadioItem value="light" icon={<Sun />}>Light</Menubar.RadioItem>
                <Menubar.RadioItem value="dark" icon={<Moon />}>Dark</Menubar.RadioItem>
                <Menubar.RadioItem value="system" icon={<Monitor />}>System</Menubar.RadioItem>
              </Menubar.RadioGroup>
              <Menubar.Separator />
              <Menubar.Item icon={<ZoomIn />} shortcut="⌘+">Zoom In</Menubar.Item>
              <Menubar.Item icon={<ZoomOut />} shortcut="⌘-">Zoom Out</Menubar.Item>
              <Menubar.Item icon={<Maximize />}>Full Screen</Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger>Format</Menubar.Trigger>
            <Menubar.Content>
              <Menubar.Item icon={<Bold />} shortcut="⌘B">Bold</Menubar.Item>
              <Menubar.Item icon={<Italic />} shortcut="⌘I">Italic</Menubar.Item>
              <Menubar.Item icon={<Underline />} shortcut="⌘U">Underline</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Sub label="Text Align">
                <Menubar.Item icon={<AlignLeft />}>Left</Menubar.Item>
                <Menubar.Item icon={<AlignCenter />}>Center</Menubar.Item>
                <Menubar.Item icon={<AlignRight />}>Right</Menubar.Item>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar>
      </div>
    );
  },
};

// ── Simple ───────────────────────────────────

export const Simple: Story = {
  render: () => (
    <div style={{ padding: "20px 20px 200px" }}>
      <Menubar>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘N">New</Menubar.Item>
            <Menubar.Item shortcut="⌘O">Open</Menubar.Item>
            <Menubar.Item shortcut="⌘S">Save</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item danger>Delete</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘Z">Undo</Menubar.Item>
            <Menubar.Item shortcut="⌘⇧Z">Redo</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item shortcut="⌘C">Copy</Menubar.Item>
            <Menubar.Item shortcut="⌘V">Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Help</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Documentation</Menubar.Item>
            <Menubar.Item>About</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </div>
  ),
};

// ── With Sub Menus ───────────────────────────

export const WithSubMenus: Story = {
  render: () => (
    <div style={{ padding: "20px 20px 250px" }}>
      <Menubar>
        <Menubar.Menu>
          <Menubar.Trigger>Insert</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Image</Menubar.Item>
            <Menubar.Item>Video</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Sub label="Table">
              <Menubar.Item>2×2</Menubar.Item>
              <Menubar.Item>3×3</Menubar.Item>
              <Menubar.Item>4×4</Menubar.Item>
              <Menubar.Item>Custom...</Menubar.Item>
            </Menubar.Sub>
            <Menubar.Sub label="Chart">
              <Menubar.Item>Bar Chart</Menubar.Item>
              <Menubar.Item>Line Chart</Menubar.Item>
              <Menubar.Item>Pie Chart</Menubar.Item>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item>Link</Menubar.Item>
            <Menubar.Item>Code Block</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Tools</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘⇧P">Command Palette</Menubar.Item>
            <Menubar.Item>Extensions</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Sub label="Language">
              <Menubar.Item>English</Menubar.Item>
              <Menubar.Item>Turkish</Menubar.Item>
              <Menubar.Item>German</Menubar.Item>
            </Menubar.Sub>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </div>
  ),
};

// ── Disabled Items ───────────────────────────

export const DisabledItems: Story = {
  render: () => (
    <div style={{ padding: "20px 20px 200px" }}>
      <Menubar>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item icon={<Undo />} shortcut="⌘Z" disabled>Undo</Menubar.Item>
            <Menubar.Item icon={<Redo />} shortcut="⌘⇧Z" disabled>Redo</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item icon={<Copy />} shortcut="⌘C">Copy</Menubar.Item>
            <Menubar.Item icon={<Clipboard />} shortcut="⌘V">Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </div>
  ),
};
