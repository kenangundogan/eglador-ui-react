import type { Meta, StoryObj } from "@storybook/react-vite";
import { toggleTheme } from "./theme";
import { Button } from "../button";

const meta: Meta = {
  title: "Foundations/Theme",
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component: `
The theme system uses Tailwind CSS v4's \`light-dark()\` function and the \`@theme\` block to define color tokens that automatically respond to the active theme.

### Usage

\`\`\`css
@import "eglador-ui-react/themes.css";
\`\`\`

Include this in your project's **root CSS file**.

### Switching Themes

\`\`\`ts
import { toggleTheme, setTheme } from "eglador-ui-react";

toggleTheme();        // Toggle between dark and light
setTheme("dark");     // Set a specific theme
\`\`\`

### How It Works

A \`data-theme\` attribute is set on the \`<html>\` element:

- \`data-theme="dark"\` → dark mode
- \`data-theme="light"\` → light mode

All color tokens are defined as \`light-dark(lightValue, darkValue)\` pairs inside a \`@theme\` block.
Tailwind classes like \`bg-zinc-100\`, \`text-zinc-700\` etc. automatically resolve to the correct value based on the active theme.

No \`dark:\` prefix classes are needed.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ZINC_SHADES = [
  { name: "zinc-50", var: "--color-zinc-50", light: "#fafafa", dark: "#09090b" },
  { name: "zinc-100", var: "--color-zinc-100", light: "#f4f4f5", dark: "#18181b" },
  { name: "zinc-200", var: "--color-zinc-200", light: "#e4e4e7", dark: "#27272a" },
  { name: "zinc-300", var: "--color-zinc-300", light: "#d4d4d8", dark: "#3f3f46" },
  { name: "zinc-400", var: "--color-zinc-400", light: "#a1a1aa", dark: "#52525b" },
  { name: "zinc-500", var: "--color-zinc-500", light: "#71717a", dark: "#71717a" },
  { name: "zinc-600", var: "--color-zinc-600", light: "#52525b", dark: "#a1a1aa" },
  { name: "zinc-700", var: "--color-zinc-700", light: "#3f3f46", dark: "#d4d4d8" },
  { name: "zinc-800", var: "--color-zinc-800", light: "#27272a", dark: "#e4e4e7" },
  { name: "zinc-900", var: "--color-zinc-900", light: "#18181b", dark: "#f4f4f5" },
  { name: "zinc-950", var: "--color-zinc-950", light: "#09090b", dark: "#fafafa" },
];

const BASE_COLORS = [
  { name: "white", var: "--color-white", light: "#ffffff", dark: "#09090b" },
  { name: "black", var: "--color-black", light: "#09090b", dark: "#ffffff" },
];

const Swatch = ({ label, cssVar, light, dark }: { label: string; cssVar: string; light: string; dark: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-md border border-zinc-200 shrink-0"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
    <div className="min-w-0">
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      <div className="text-xs font-mono text-zinc-500">
        {light} → {dark}
      </div>
    </div>
  </div>
);

export const DocsOnly: Story = {
  name: "Overview",

  render: () => (
    <div className="p-10 flex flex-col gap-10 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Theme Tokens</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Toggle the theme to see <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded">light-dark()</code> values swap in real time.
          </p>
        </div>
        <Button color="black" onClick={() => toggleTheme()}>
          Toggle Dark / Light
        </Button>
      </div>

      {/* Base Colors */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">Base</h3>
        <div className="grid grid-cols-2 gap-3">
          {BASE_COLORS.map((c) => (
            <Swatch key={c.name} label={c.name} cssVar={c.var} light={c.light} dark={c.dark} />
          ))}
        </div>
      </div>

      {/* Zinc Palette */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">Zinc</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ZINC_SHADES.map((c) => (
            <Swatch key={c.name} label={c.name} cssVar={c.var} light={c.light} dark={c.dark} />
          ))}
        </div>
      </div>

      {/* Token Reference */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-3">CSS Token Reference</h3>
        <div className="border border-zinc-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-left">
                <th className="px-4 py-2 font-medium text-zinc-700">Token</th>
                <th className="px-4 py-2 font-medium text-zinc-700">Light</th>
                <th className="px-4 py-2 font-medium text-zinc-700">Dark</th>
                <th className="px-4 py-2 font-medium text-zinc-700">Preview</th>
              </tr>
            </thead>
            <tbody>
              {[...BASE_COLORS, ...ZINC_SHADES].map((c, i) => (
                <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-700">{c.var}</td>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">{c.light}</td>
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">{c.dark}</td>
                  <td className="px-4 py-2">
                    <div
                      className="w-6 h-6 rounded border border-zinc-200"
                      style={{ backgroundColor: `var(${c.var})` }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
};
