import { defineConfig } from "vitepress";
import path from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Zoom",
  description: "The Ultimate Zoomable image component",

  base: "/vue3-zoomer/",

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/logo.svg",
      },
    ],
  ],

  vite: {
    resolve: {
      alias: {
        "~": path.join(process.cwd(), "/src"),
      },
    },
  },
  themeConfig: {
    search: { provider: "local" },
    outline: [2, 3],
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
      { text: "Examples", link: "/examples" },
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
      { icon: "github", link: "https://github.com/vue3-zoomer/vue3-zoomer" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 vue3-zoomer",
    },
  },
});
