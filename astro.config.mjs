import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://resume.kcemanes.com",
  trailingSlash: "never",
  integrations: [sitemap()],
  // Astro injects a floating toolbar at bottom-centre during `astro dev`. It is
  // dev-only and never shipped in the build, but it overlaps the page, so it is
  // off here too.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // The whole page is ~15 KB of CSS; inlining it removes a render-blocking
    // request and the site loads in a single round trip.
    inlineStylesheets: "always",
  },
});
