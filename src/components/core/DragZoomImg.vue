<template>
  <div
    ref="containerRef"
    class="overflow-hidden"
    :class="{
      'cursor-grab': isZoomed && !isDragging,
      'cursor-grabbing': isZoomed && isDragging,
      'cursor-zoom-in': !isZoomed,
      'cursor-zoom-out': isZoomed && currentScale >= zoomScale,
    }"
    @mouseenter="handleMouseEnter"
    @mousedown="handlePressDown"
    @mousemove="drag"
    @mouseup="handlePressUp"
    @mouseleave="handleMouseLeave"
    @touchstart.prevent="handlePressDown"
    @touchmove.prevent="drag"
    @touchend.prevent="handlePressUp"
  >
    <img
      alt="zoom-image"
      draggable="false"
      class="zoom-effect h-full w-full object-fill"
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
import { type PropType, ref, computed, useTemplateRef } from "vue";
import {
  getAbsTouchPosition,
  getRelTouchPosition,
} from "~/utils/touchPosition";
import { getRelCursorPosition } from "~/utils/cursorPosition";
import { calcDragOffset } from "~/utils/zoom";
import { useTransition } from "~/composables/useTransition";
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
    default: "click",
  },
  step: {
    type: Number,
  },
});

const currentScale = defineModel("currentScale", {
  default: 1,
});

const zoomedImgOffset = defineModel("zoomedImgOffset", {
  default: {
    left: 0,
    top: 0,
  },
});

const prevPosition = ref({ left: 0, top: 0 });
const mouseDownPosition = ref({ left: 0, top: 0 });
const isDragging = ref(false);

const isZoomed = computed(() => currentScale.value > 1);

const containerRef = useTemplateRef("containerRef");

const { isTransition, startTransition } = useTransition();
const { multiStepZoomIn, zoomDir } = useMultiZoom(
  currentScale,
  zoomedImgOffset,
  containerRef,
  props.zoomScale,
);

const handleMouseEnter = (event: MouseEvent) => {
  if (props.trigger === "hover") {
    const { pos: relPos } = getRelCursorPosition(event, containerRef.value);
    startTransition();
    multiStepZoomIn(currentScale.value, relPos, props.step ?? props.zoomScale);
  }
};

const handleMouseLeave = () => {
  if (props.trigger === "hover") {
    resetPosition();
  }
};

const handlePressDown = (event: MouseEvent | TouchEvent) => {
  const currentPos = getAbsPos(event);
  prevPosition.value = currentPos;
  mouseDownPosition.value = currentPos;

  if (isZoomed.value) {
    isDragging.value = true;
  }
};

const drag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  const currentPos = getAbsPos(event);

  zoomedImgOffset.value = calcDragOffset(
    prevPosition.value,
    currentPos,
    zoomedImgOffset.value,
    containerRef.value,
    currentScale.value,
  );
  prevPosition.value = currentPos;
};

const handlePressUp = (event: TouchEvent | MouseEvent) => {
  isDragging.value = false;

  const absPos = getAbsPos(event);
  const relPos = getRelPos(event);

  if (
    !isZoomed.value ||
    (mouseDownPosition.value.left === absPos.left &&
      mouseDownPosition.value.top === absPos.top &&
      isZoomed.value)
  ) {
    startTransition();
    multiStepZoomIn(currentScale.value, relPos, props.step ?? props.zoomScale);
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

const getAbsPos = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    return { left: event.clientX, top: event.clientY };
  } else {
    return getAbsTouchPosition(event);
  }
};

const getRelPos = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    const { pos: relPos } = getRelCursorPosition(event, containerRef.value);
    return relPos;
  } else {
    return getRelTouchPosition(event, containerRef.value);
  }
};

defineExpose({
  zoomDir,
  multiZoom: () => {
    // calculate from zoomed image offset the cursor position
    const rect = containerRef.value?.getBoundingClientRect();
    const ratio = currentScale.value - 1 === 0 ? 1 : currentScale.value - 1;
    const cursorPos = {
      clientX: -zoomedImgOffset.value.left / ratio + (rect?.left ?? 0),
      clientY: -zoomedImgOffset.value.top / ratio + (rect?.top ?? 0),
    };

    handlePressDown(new MouseEvent("mousedown", cursorPos));
    handlePressUp(new MouseEvent("mouseup", cursorPos));
  },
});
</script>
