<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    :style="{ cursor: cursorStyle }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="resetPosition"
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
    default: "click",
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

const calculateZoomPosition = (x: number, y: number) => {
  // Calculate the ratio of the mouse position relative to the element's dimensions
  const xRatio = x / elementWidth.value;
  const yRatio = y / elementHeight.value;

  // Calculate the dimensions of the zoomed image
  const zoomedWidth = elementWidth.value * props.zoomScale;
  const zoomedHeight = elementHeight.value * props.zoomScale;

  let newLeft = -(zoomedWidth - elementWidth.value) * xRatio;
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
    currentScale.value = props.zoomScale;
    setTimeout(() => (isTransition.value = false), 250);

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    const { newLeft, newTop } = calculateZoomPosition(
      elementX.value,
      elementY.value,
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

const handleMouseMove = () => {
  if (!isOutside.value && isZoomed.value && !isTransition.value) {
    const { newLeft, newTop } = calculateZoomPosition(
      elementX.value,
      elementY.value,
    );
    zoomedImgOffset.value = {
      left: newLeft,
      top: newTop,
    };
  }
};
const handleTouchStart = (event: TouchEvent) => {
  if (props.trigger === "click") {
    isZoomed.value = true;
    currentScale.value = props.zoomScale;
    setTimeout(() => (isTransition.value = false), 250);

    const touch = event.touches[0];
    const rect = containerRef.value?.getBoundingClientRect();

    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const { newLeft, newTop } = calculateZoomPosition(x, y);
      zoomedImgOffset.value = { left: newLeft, top: newTop };
    }
  }
};

const handleTouchMove = (event: TouchEvent) => {
  if (isZoomed.value && !isTransition.value) {
    const touch = event.touches[0];
    const rect = containerRef.value?.getBoundingClientRect();

    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const { newLeft, newTop } = calculateZoomPosition(x, y);
      zoomedImgOffset.value = { left: newLeft, top: newTop };
    }
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
