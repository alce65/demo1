// @ts-check
import { defineConfig, envField } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  env: {
      schema: {
          SHOW_BUY_BUTTON: envField.boolean({
              default: true,
              context: 'server',
              access: 'public',
          }),
          SCORE_API_ENDPOINT: envField.string({
              context: 'server',
              access: 'public',
          }),
      },
  },

  adapter: node({
    mode: 'standalone',
  }),
});