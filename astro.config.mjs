// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import db from "@astrojs/db";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [db()],
  adapter: cloudflare(),

  env: {
    schema: {
      ASTRO_DB_REMOTE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      ASTRO_DB_APP_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
