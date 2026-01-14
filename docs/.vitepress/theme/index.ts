import DefaultTheme from "vitepress/theme";
import AiddLink from "./components/AiddLink.vue";
import Layout from "./Layout.vue";
import "../../css/main.css";

export default {
  extends: DefaultTheme,
  Layout,

  // @ts-expect-error: vitepress bug
  enhanceApp({ app }) {
    app.component("AiddLink", AiddLink);
  },
};
