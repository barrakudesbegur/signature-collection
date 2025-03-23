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
      BASE64_ENCODED_ENCRYPT_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      BASE64_ENCODED_DECRYPT_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
