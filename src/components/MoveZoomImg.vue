<template>
  <div
    class="h-full w-full cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    :style="{ cursor: zoomDir === 'OUT' ? 'zoom-out' : 'zoom-in' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <img
      class="h-full w-full object-fill"
      ref="imgRef"
      alt="zoom-image"
      :src="src"
      :style="{
        transform: `translate(${zoomedImgOffset.left}px, ${zoomedImgOffset.top}px) scale(${currentScale})`,
        transformOrigin: '0 0',
        transition: isTransition ? 'transform 100ms ease-in-out' : 'none',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from "vue";
import { useMouseInElement } from "@vueuse/core";
import { calZoomedImgOffset } from "~/utils/zoom";
import useMultiZoom from "~/composables/useMultiZoom";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
  trigger: {
    type: String as PropType<"click" | "hover">,
    default: "hover",
  },
  step: {
    type: Number,
  },
});

const imgRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
const isTransition = ref(true);
const currentScale = defineModel("currentScale", {
  default: 1,
});
const zoomedImgOffset = defineModel("zoomedImgOffset", {
  default: {
    left: 0,
    top: 0,
  },
});

const isZoomed = computed(() => currentScale.value > 1);
const { zoomDir, zoomInOut } = useMultiZoom();

const { elementX, elementY, elementHeight, elementWidth, isOutside } =
  useMouseInElement(containerRef);

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    currentScale.value = props.zoomScale;
    setTimeout(() => (isTransition.value = false), 250);

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    zoomedImgOffset.value = calZoomedImgOffset(
      elementX.value,
      elementY.value,
      elementWidth.value,
      elementHeight.value,
      props.zoomScale,
    );
  }
};

const handleMouseLeave = () => {
  resetPosition();
};

const handleClick = () => {
  // single click
  if (!props.step && props.trigger === "click") {
    if (!isZoomed.value) {
      currentScale.value = props.zoomScale;
      setTimeout(() => (isTransition.value = false), 250);

      zoomedImgOffset.value = calZoomedImgOffset(
        elementX.value,
        elementY.value,
        elementWidth.value,
        elementHeight.value,
        props.zoomScale,
      );
    } else {
      resetPosition();
    }
  }
  // multi click
  else if (props.step) {
    const scale = zoomInOut(currentScale.value, props.zoomScale, props.step);
    setTimeout(() => (isTransition.value = false), 250);

    currentScale.value = scale;
    zoomedImgOffset.value = calZoomedImgOffset(
      elementX.value,
      elementY.value,
      elementWidth.value,
      elementHeight.value,
      scale,
    );
  }
};

const handleMouseMove = () => {
  if (!isOutside.value && isZoomed.value && !isTransition.value) {
    zoomedImgOffset.value = calZoomedImgOffset(
      elementX.value,
      elementY.value,
      elementWidth.value,
      elementHeight.value,
      currentScale.value,
    );
  }
};

const resetPosition = () => {
  isTransition.value = true;
  currentScale.value = 1;
  zoomedImgOffset.value = {
    left: 0,
    top: 0,
  };
};
</script>
