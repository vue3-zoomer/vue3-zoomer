import { TransitionPresets, useTransition } from "@vueuse/core";
import { PositionType } from "~/types";
import { computed, ref } from "vue";

export default function useZoomTransition(
  initPosition: PositionType,
  initScale: number,
  duration: number = 180,
) {
  const leftSource = ref(initPosition.left);
  const topSource = ref(initPosition.top);
  const scaleSource = ref(initScale);
  const isTransition = ref(false);

  const scaleTrans = useTransition(scaleSource, {
    duration: duration,
    onStarted: () => {
      isTransition.value = true;
    },
    onFinished: () => {
      isTransition.value = false;
    },
    transition: TransitionPresets.easeInOutSine,
  });

  const leftTrans = useTransition(leftSource, {
    duration: duration,
    transition: TransitionPresets.easeInOutSine,
  });

  const topTrans = useTransition(topSource, {
    duration: duration,
    transition: TransitionPresets.easeInOutSine,
  });

  const position = computed(() => {
    if (isTransition.value) {
      return {
        top: topTrans.value,
        left: leftTrans.value,
      };
    } else {
      return {
        top: topSource.value,
        left: leftSource.value,
      };
    }
  });

  const scale = computed(() => {
    if (isTransition.value) {
      return scaleTrans.value;
    } else {
      return scaleSource.value;
    }
  });

  return {
    position,
    scale,
    isTransition,
    scaleSource,
    leftSource,
    topSource,
  };
}
