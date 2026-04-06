import type { Preview,Decorator } from '@storybook/react-vite'
import '../src/storybook.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme switcher",
      defaultValue: "light",
      toolbar: {
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    options: {
      storySort: {
        order: ['Welcome', 'Foundations', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export const decorators: Decorator[] = [
  (Story, context) => {
    const theme = context.globals.theme;
    const html = document.documentElement;

    html.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );

    return Story();
  },
];

export default preview;