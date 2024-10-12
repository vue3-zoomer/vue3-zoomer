<template>
  <div
    class="h-full w-full cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    :style="{ cursor: cursorStyle }"
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
        transition: isTransition ? 'transform 200ms ease-in-out' : 'none',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { PropType, ref, computed } from "vue";
import { calZoomedImgOffset } from "~/utils/zoom";

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
});

const imgRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
const isZoomed = ref(false);
const isTransition = ref(true);

const zoomedImgOffset = defineModel("zoomedImgOffset", {
  default: {
    left: 0,
    top: 0,
  },
});

const currentScale = defineModel("currentScale", {
  default: 1,
});

const { elementX, elementY, elementHeight, elementWidth, isOutside } =
  useMouseInElement(containerRef);

const cursorStyle = computed(() => (isZoomed.value ? "zoom-out" : "zoom-in"));

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    isZoomed.value = true;
    currentScale.value = props.zoomScale;
    setTimeout(() => (isTransition.value = false), 250);

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    zoomedImgOffset.value = calZoomedImgOffset(
      elementX.value,
      elementY.value,
      elementWidth.value,
      elementHeight.value,
      currentScale.value,
    );
  }
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  resetPosition();
};

const handleClick = () => {
  if (props.trigger === "click") {
    isZoomed.value = !isZoomed.value;

    if (isZoomed.value) {
      currentScale.value = props.zoomScale;
      setTimeout(() => (isTransition.value = false), 250);

      zoomedImgOffset.value = calZoomedImgOffset(
        elementX.value,
        elementY.value,
        elementWidth.value,
        elementHeight.value,
        props.zoomScale,
      );
    }
  } else {
    resetPosition();
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
