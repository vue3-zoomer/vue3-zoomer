import type { App } from "vue";
import ZoomImg from "./components/ZoomImg.vue";
import Magnifier from "./components/Magnifier.vue";

export { ZoomImg, Magnifier };

export default {
  install: (app: App) => {
    app.component("ZoomImg", ZoomImg);
    app.component("Magnifier", Magnifier);
  },
};
