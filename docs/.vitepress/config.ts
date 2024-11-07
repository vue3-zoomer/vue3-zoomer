import { defineConfig } from "vitepress";
import path, { resolve } from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Zoom",
  description: "A VitePress Site",

  head: [["link", { rel: "icon", href: "../assets/icons/Logo.png" }]],

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
      { text: "Guide", link: "/guide/introduction" },
      { text: "Examples", link: "/guide/introduction" },
    ],

    sidebar: [
      {
        text: "Quick start",
        items: [
          { text: "Introduction", link: "/guide/introduction" },
          { text: "Installation", link: "/guide/installation" },
        ],
      },
      {
        text: "Components",
        items: [
          { text: "ZoomImg", link: "/guide/zoom-img" },
          { text: "Magnifier", link: "/guide/magnifier" },
          { text: "Controls", link: "/guide/controls" },
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
