import { ref } from "vue";

export default function useMultiZoom() {
  const zoomDir = ref<"IN" | "OUT">("IN");

  const zoomInOut = (scale: number, maxScale: number, step: number) => {
    let zoomScale = scale;

    if (zoomDir.value === "IN") {
      zoomScale = Math.min(scale + step, maxScale);
    } else {
      zoomScale = Math.max(scale - step, 1);
    }

    if (zoomScale === 1) {
      zoomDir.value = "IN";
    } else if (zoomScale === maxScale) {
      zoomDir.value = "OUT";
    }

    return zoomScale;
  };

  return { zoomDir, zoomInOut };
}