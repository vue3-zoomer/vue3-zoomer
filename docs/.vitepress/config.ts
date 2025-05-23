import { defineConfig } from "vitepress";
import path from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue3 Zoomer",
  description: "The Ultimate Zoomable image component",
  base: "/",
  sitemap: {
    hostname: "https://vue3-zoomer.vuedoo.org",
  },
  head: [
    ["link", { rel: "icon", href: "favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content: "Vue3 Zoomer - The Ultimate Zoomable Image Component",
      },
    ],
    ["meta", { property: "og:site_name", content: "Vue3 Zoomer" }],
    [
      "meta",
      {
        property: "og:image",
        content: "https://vue3-zoomer.vuedoo.org/card.png",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://vue3-zoomer.vuedoo.org/",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Vue3 Zoomer is a beautiful image viewer component for Vue.js projects, making it easy to create stunning zoomable images for ecommerce, art galleries, infographics, and any other image you need to zoom into.",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Vue3 Zoomer" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "The Ultimate Zoomable image component for Vue.js",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://vue3-zoomer.vuedoo.org/card.png",
      },
    ],
    [
      "meta",
      {
        name: "google-site-verification",
        content: "UwPimFC7pZ67l3VejqZhlU959GVThm_sFfwSvR-j1mg",
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
      // { text: "Examples", link: "/examples" },
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
        text: "Styling Guide",
        items: [{ text: "Classes", link: "/guide/styles-guide" }],
      },
      // {
      //   text: "Examples",
      //   items: [],
      // },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vue3-zoomer/vue3-zoomer" },
      {
        icon: {
          svg: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="540" height="210" viewBox="0 0 18 7" style="width: 24px"><path fill="#CB3837" d="M0 0h18v6H9v1H5V6H0V0zm1 5h2V2h1v3h1V1H1v4zm5-4v5h2V5h2V1H6zm2 1h1v2H8V2zm3-1v4h2V2h1v3h1V2h1v3h1V1h-6z"/><path fill="#FFF" d="M1 5h2V2h1v3h1V1H1zM6 1v5h2V5h2V1H6zm3 3H8V2h1v2zM11 1v4h2V2h1v3h1V2h1v3h1V1z"/></svg>',
        },
        link: "https://www.npmjs.com/package/vue3-zoomer",
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 vue3-zoomer",
    },
  },
});
