<template>
  <div
    ref="containerRef"
    class="overflow-hidden"
    :class="{
      'cursor-grab': isZoomed && !isDragging,
      'cursor-grabbing': isZoomed && isDragging,
      'cursor-zoom-in': !isZoomed,
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
import { ref, computed, useTemplateRef, PropType } from "vue";
import {
  getAbsTouchPosition,
  getRelTouchPosition,
} from "~/utils/touchPosition";
import { useTransition } from "~/composables/useTransition";
import { calcDragOffset, calZoomedImgOffset } from "~/utils/zoom";
import { getRelCursorPosition } from "~/utils/cursorPosition";

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
    containerRef.value?.clientWidth ?? 0,
    containerRef.value?.clientHeight ?? 0,
    currentScale.value,
  );
  prevPosition.value = currentPos;
};

const handlePressUp = (event: TouchEvent | MouseEvent) => {
  isDragging.value = false;

  const currentPos = getAbsPos(event);

  if (props.trigger === "click") {
    if (!isZoomed.value) {
      const currentRelPos = getRelPos(event);
      startTransition();
      currentScale.value = props.zoomScale;
      zoomedImgOffset.value = calZoomedImgOffset(
        currentRelPos,
        containerRef.value,
        props.zoomScale,
      );
    } else if (
      mouseDownPosition.value.left === currentPos.left &&
      mouseDownPosition.value.top === currentPos.top &&
      isZoomed.value
    ) {
      resetPosition();
    }
  }
};

const resetPosition = () => {
  isTransition.value = true;
  currentScale.value = 1;
  zoomedImgOffset.value = { left: 0, top: 0 };
};

const getAbsPos = (event: MouseEvent | TouchEvent) => {
  if (event instanceof TouchEvent) {
    return getAbsTouchPosition(event);
  } else {
    return { left: event.clientX, top: event.clientY };
  }
};

const getRelPos = (event: MouseEvent | TouchEvent) => {
  if (event instanceof TouchEvent) {
    return getRelTouchPosition(event, containerRef.value);
  } else {
    const { pos: relPos } = getRelCursorPosition(event, containerRef.value);
    return relPos;
  }
};
</script>
