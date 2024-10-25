<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    :style="{ cursor: zoomDir === 'OUT' ? 'zoom-out' : 'zoom-in' }"
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
        transition: isTransition ? 'transform 100ms ease-in-out' : 'none',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, useTemplateRef } from "vue";
import { calZoomedImgOffset } from "~/utils/zoom";
import useMultiZoom from "~/composables/useMultiZoom";
import { getCursorPosition } from "~/utils/cursorPosition";
import { useTransition } from "~/composables/useTransition";

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
  step: {
    type: Number,
  },
  presist: {
    type: Boolean,
  },
});

const currentScale = defineModel("currentScale", {
  default: 1,
});
const containerRef = useTemplateRef("containerRef");

const { startTransition, isTransition } = useTransition();

const zoomedImgOffset = defineModel("zoomedImgOffset", {
  default: {
    left: 0,
    top: 0,
  },
});

const isZoomed = computed(() => currentScale.value > 1);
const { zoomDir, zoomInOut } = useMultiZoom();

const handleMouseEnter = (event: MouseEvent) => {
  if (props.trigger === "hover") {
    currentScale.value = props.zoomScale;
    startTransition(250);

    const cursorPosition = getCursorPosition(event, containerRef.value);

    // Calculate the new position for the zoomed image based on the current mouse coordinates
    zoomedImgOffset.value = calZoomedImgOffset(
      cursorPosition.relativeX,
      cursorPosition.relativeY,
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
      props.zoomScale,
    );
  }
};

const handleMouseLeave = () => {
  if (props.presist) return;
  resetPosition();
};

const handleClick = (event: MouseEvent) => {
  // single click
  if (!props.step && props.trigger === "click") {
    if (!isZoomed.value) {
      currentScale.value = props.zoomScale;
      startTransition(150);

      const cursorPosition = getCursorPosition(event, containerRef.value);

      zoomedImgOffset.value = calZoomedImgOffset(
        cursorPosition.relativeX,
        cursorPosition.relativeY,
        containerRef.value.clientWidth,
        containerRef.value.clientHeight,
        props.zoomScale,
      );
    } else {
      resetPosition();
    }
  }
  // multi click
  else if (props.step) {
    const scale = zoomInOut(currentScale.value, props.zoomScale, props.step);
    const cursorPosition = getCursorPosition(event, containerRef.value);

    startTransition(150);
    currentScale.value = scale;
    zoomedImgOffset.value = calZoomedImgOffset(
      cursorPosition.relativeX,
      cursorPosition.relativeY,
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
      scale,
    );
  }
};

const handleMouseMove = (event: MouseEvent) => {
  const cursorPosition = getCursorPosition(event, containerRef.value);

  if (!cursorPosition.isOutside && isZoomed.value && !isTransition.value) {
    zoomedImgOffset.value = calZoomedImgOffset(
      cursorPosition.relativeX,
      cursorPosition.relativeY,
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
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
