import { defineConfig } from "vitepress";
import path, { resolve } from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Zoom",
  description: "A VitePress Site",
  vite: {
    resolve: {
      alias: {
        "~": path.join(process.cwd(), "/src"),
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      { text: "Examples", link: "/guide" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
