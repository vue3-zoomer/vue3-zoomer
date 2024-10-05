import { TransitionPresets, useTransition } from "@vueuse/core";
import { PositionType } from "~/types";
import { computed, Ref, ref } from "vue";

export default function useZoomTransition(
  offsetSource: Ref<PositionType>,
  scaleSource: Ref<number>,
  duration: number = 180,
) {
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

  const leftTrans = useTransition(() => offsetSource.value?.left, {
    duration: duration,
    transition: TransitionPresets.easeInOutSine,
  });

  const topTrans = useTransition(() => offsetSource.value?.top, {
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
      return offsetSource.value;
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
    scale,
    position,
    isTransition,
  };
}
