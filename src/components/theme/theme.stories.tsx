import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Plus, Check, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { toggleTheme } from "./theme";

import { Button } from "../button";
import { ButtonGroup, type ButtonGroupProps } from "../button-group";
import { Badge, type BadgeProps } from "../badge";



const ALL_COLORS = ["default", "black", "primary", "danger", "success", "warning", "info"] as const;

const meta: Meta = {
  title: "Foundations/Theme",
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component: `

This system works by adding a **data-theme** attribute to the \`<html>\` element.

### Usage

\`\`\`css
@import "eglador-ui-react/themes.css";
\`\`\`

You should include this in your project's **root CSS file**.

---

### How It Works

- \`data-theme="dark"\` → enables dark mode
- \`data-theme="light"\` → enables light mode

---

You can test it live using the button below:
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const DocsOnly: Story = {
  name: "Overview",

  render: (args) => (
    <div className="p-10 flex flex-col gap-6">
      <Button color="black" onClick={() => toggleTheme()}>
        Toggle Dark / Light
      </Button>

      <p className="bg-black text-white p-5 text-sm opacity-70">
        The <code>data-theme</code> attribute is added to or removed from the HTML element.
      </p>
      
    </div>
  ),
};