<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    :style="{ cursor: cursorStyle }"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <img
      class="zoom-effect h-full w-full object-contain"
      ref="imgRef"
      alt="zoom-image"
      :src="src"
      :style="{
        transform: `translate(${left}px, ${top}px) scale(${isZoomed ? props.zoomScale : 1})`,
        transformOrigin: '0 0',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { PropType, ref, computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 10,
  },
  trigger: {
    type: String as PropType<"click" | "hover">,
    default: "hover",
  },
});

const imgRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
const left = ref(0);
const top = ref(0);
const isZoomed = ref(false);

const { elementX, elementY, elementHeight, elementWidth, isOutside } =
  useMouseInElement(containerRef);

const cursorStyle = computed(() => {
  return isZoomed.value ? "zoom-out" : "zoom-in";
});

const calculateZoomPosition = (x: number, y: number) => {
  // Calculate the ratio of the mouse position relative to the element's dimensions
  const xRatio = x / elementWidth.value;
  const yRatio = y / elementHeight.value;

  // Calculate the dimensions of the zoomed image
  const zoomedWidth = elementWidth.value * props.zoomScale;
  const zoomedHeight = elementHeight.value * props.zoomScale;

  //  zoom based on the mouse's x position
  let newLeft = -(zoomedWidth - elementWidth.value) * xRatio;

  //  zoomed based on the mouse's y position
  let newTop = -(zoomedHeight - elementHeight.value) * yRatio;

  // Ensure left position does not move the image out of bounds
  newLeft = Math.max(Math.min(newLeft, 0), elementWidth.value - zoomedWidth);

  // Ensure top position does not move the image out of bounds
  newTop = Math.max(Math.min(newTop, 0), elementHeight.value - zoomedHeight);

  return { newLeft, newTop };
};

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    isZoomed.value = true;

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    const { newLeft, newTop } = calculateZoomPosition(
      elementX.value,
      elementY.value,
    );

    // Update the left and top translation values to position the zoomed image correctly
    left.value = newLeft;
    top.value = newTop;
  }
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  resetPosition();
};

const handleClick = (event: MouseEvent) => {
  if (props.trigger === "click") {
    isZoomed.value = !isZoomed.value;

    if (isZoomed.value) {
      // Get the bounding rectangle of the container to determine its position. getBoundingClientRect=> method in DOM to get the size of element relative to the viewport
      const rect = containerRef.value?.getBoundingClientRect();

      if (rect) {
        // Calculate the mouse position relative to the container
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const { newLeft, newTop } = calculateZoomPosition(x, y);

        // Update the left and top translation values to position the zoomed image correctly
        left.value = newLeft;
        top.value = newTop;
      }
    } else {
      resetPosition();
    }
  }
};

const handleMouseMove = () => {
  if (!isOutside.value && isZoomed.value) {
    const { newLeft, newTop } = calculateZoomPosition(
      elementX.value,
      elementY.value,
    );
    left.value = newLeft;
    top.value = newTop;
  }
};

const resetPosition = () => {
  left.value = 0;
  top.value = 0;
};
</script>

<style scoped>
/* FIXME:  */
.zoom-effect {
  transition: scale;
}
</style>
