import { type Ref, ref } from "vue";
import type { PositionType } from "~/types";
import { calZoomedImgOffset } from "~/utils/zoom";

export default function useMultiZoom(
  scaleRef: Ref<number>,
  offsetRef: Ref<PositionType>,
  imgContainer: Ref<HTMLDivElement | null>,
  maxScale: number = 2,
) {
  const zoomDir = ref<"IN" | "OUT">("IN");

  const multiStepZoomIn = (
    scale: number,
    relPos: PositionType,
    step: number,
  ) => {
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

    scaleRef.value = zoomScale;
    offsetRef.value = calZoomedImgOffset(relPos, imgContainer.value, zoomScale);
  };

  return { zoomDir, multiStepZoomIn };
}
