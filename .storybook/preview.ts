import type { Preview } from '@storybook/react-vite'
import '../src/storybook.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Welcome', 'Components'],
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

export default preview;