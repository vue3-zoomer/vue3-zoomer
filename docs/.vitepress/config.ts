import { defineConfig } from "vitepress";
import path, { resolve } from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Zoom",
  description: "A VitePress Site",

  head: [["link", { rel: "icon", href: "../assets/icons/logo.svg" }]],

  vite: {
    resolve: {
      alias: {
        "~": path.join(process.cwd(), "/src"),
      },
    },
  },
  themeConfig: {
    logo: "/assets/icons/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide" },
      { text: "Examples", link: "/guide" },
    ],

    sidebar: [
      {
        text: "Quick start",
        items: [
          { text: "Introduction", link: "/markdown-examples" },
          { text: "Installation", link: "/api-examples" },
        ],
      },
      {
        text: "Components",
        items: [
          { text: "ZoomImg", link: "/markdown-examples" },
          { text: "Magnifier", link: "/api-examples" },
        ],
      },
      {
        text: "Examples",
        items: [],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
