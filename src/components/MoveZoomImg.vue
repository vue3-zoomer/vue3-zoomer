<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    :style="{ cursor: cursorStyle }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <img
      class="h-full w-full object-fill"
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
import { PropType, ref, computed, useTemplateRef } from "vue";
import { getCursorPosition } from "~/utils/cursorPosition";

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

const containerRef = useTemplateRef("containerRef");

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

const cursorStyle = computed(() => (isZoomed.value ? "zoom-out" : "zoom-in"));

const calculateZoomPosition = (x: number, y: number) => {
  const elementWidth = containerRef.value?.clientWidth ?? 1;
  const elementHeight = containerRef.value?.clientHeight ?? 1;

  // Calculate the ratio of the mouse position relative to the element's dimensions
  const xRatio = x / elementWidth;
  const yRatio = y / elementHeight;

  // Calculate the dimensions of the zoomed image
  const zoomedWidth = elementWidth * props.zoomScale;
  const zoomedHeight = elementHeight * props.zoomScale;

  let newLeft = -(zoomedWidth - elementWidth) * xRatio;
  let newTop = -(zoomedHeight - elementHeight) * yRatio;

  // Ensure left position does not move the image out of bounds
  newLeft = Math.max(Math.min(newLeft, 0), elementWidth - zoomedWidth);

  // Ensure top position does not move the image out of bounds
  newTop = Math.max(Math.min(newTop, 0), elementHeight - zoomedHeight);

  return { newLeft, newTop };
};

const handleMouseEnter = (event: MouseEvent) => {
  if (props.trigger === "hover") {
    isZoomed.value = true;
    currentScale.value = props.zoomScale;
    setTimeout(() => (isTransition.value = false), 250);

    const cursorPosition = getCursorPosition(event, containerRef.value);

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    const { newLeft, newTop } = calculateZoomPosition(
      cursorPosition.relativeX,
      cursorPosition.relativeY,
    );

    // Update the left and top translation values to position the zoomed image correctly
    zoomedImgOffset.value = {
      left: newLeft,
      top: newTop,
    };
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
      currentScale.value = props.zoomScale;
      setTimeout(() => (isTransition.value = false), 250);

      // Get the bounding rectangle of the container to determine its position. getBoundingClientRect=> method in DOM to get the size of element relative to the viewport
      const rect = containerRef.value?.getBoundingClientRect();

      if (rect) {
        // Calculate the mouse position relative to the container
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const { newLeft, newTop } = calculateZoomPosition(x, y);

        // Update the left and top translation values to position the zoomed image correctly
        zoomedImgOffset.value = {
          left: newLeft,
          top: newTop,
        };
      }
    } else {
      resetPosition();
    }
  }
};

const handleMouseMove = (event: MouseEvent) => {
  const cursorPosition = getCursorPosition(event, containerRef.value);

  if (!cursorPosition.isOutside && isZoomed.value && !isTransition.value) {
    const { newLeft, newTop } = calculateZoomPosition(
      cursorPosition.relativeX,
      cursorPosition.relativeY,
    );
    zoomedImgOffset.value = {
      left: newLeft,
      top: newTop,
    };
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
