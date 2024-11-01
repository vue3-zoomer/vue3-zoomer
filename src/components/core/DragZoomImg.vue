<template>
  <div
    ref="containerRef"
    class="overflow-hidden"
    :class="{
      'cursor-grab': isZoomed && !isDragging,
      'cursor-grabbing': isZoomed && isDragging,
      'cursor-zoom-in': !isZoomed,
      'cursor-zoom-out': isZoomed && currentScale >= props.zoomScale,
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
import { useTransition } from "~/composables/useTransition";
import { calcDragOffset } from "~/utils/zoom";
import { getRelCursorPosition } from "~/utils/cursorPosition";
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

const containerRef = useTemplateRef("containerRef");

const isZoomed = computed(() => currentScale.value > 1);

const { isTransition, startTransition } = useTransition();
const { multiStepZoomIn, zoomDir } = useMultiZoom(
  currentScale,
  zoomedImgOffset,
  containerRef,
  props.zoomScale,
);

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    startTransition();
    currentScale.value = props.zoomScale;
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

  if (isZoomed.value && props.trigger === "click") {
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

  if (!isZoomed.value) {
    startTransition();
    multiStepZoomIn(currentScale.value, relPos, props.step ?? props.zoomScale);
  } else if (
    mouseDownPosition.value.left === absPos.left &&
    mouseDownPosition.value.top === absPos.top &&
    isZoomed.value
  ) {
    if (props.step) {
      startTransition();
      multiStepZoomIn(currentScale.value, relPos, props.step);
    } else {
      startTransition();
      multiStepZoomIn(
        currentScale.value,
        relPos,
        props.step ?? props.zoomScale,
      );
    }
    mouseDownPosition.value.left = absPos.left;
    mouseDownPosition.value.top = absPos.top;
  }
};

const resetPosition = () => {
  isTransition.value = true;
  currentScale.value = 1;
  zoomedImgOffset.value = { left: 0, top: 0 };
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
  multiZoom: () => {
    handlePressDown(
      new MouseEvent("mousedown", {
        clientX: mouseDownPosition.value.left,
        clientY: mouseDownPosition.value.top,
      }),
    );
    handlePressUp(
      new MouseEvent("mouseup", {
        clientX: mouseDownPosition.value.left,
        clientY: mouseDownPosition.value.top,
      }),
    );
  },
  zoomDir,
});
</script>
