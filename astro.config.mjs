// @ts-check
import db from "@astrojs/db";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
  integrations: [db()],
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
