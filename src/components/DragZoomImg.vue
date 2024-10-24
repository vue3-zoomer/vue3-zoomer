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
    @mousedown="startDrag"
    @mousemove="drag"
    @mouseup="stopDrag"
    @mouseleave="handleMouseLeave"
    @touchstart.prevent="startDrag"
    @touchmove.prevent="drag"
    @touchend.prevent="stopDrag"
  >
    <img
      alt="zoom-image"
      draggable="false"
      class="zoom-effect h-full w-full object-fill"
      :src="src"
      :style="{
        transform: `scale(${scale}) translate(${offset.left}px, ${offset.top}px)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, PropType } from "vue";
import { getTouchPosition } from "~/utils/touchPosition";

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

const containerRef = useTemplateRef("containerRef");

const prevPosition = ref({ left: 0, top: 0 });
const offset = ref({ left: 0, top: 0 });
const mouseDownPosition = ref({ left: 0, top: 0 });

const isZoomed = ref(false);
const isDragging = ref(false);

const scale = computed(() => (isZoomed.value ? props.zoomScale : 1));

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    isZoomed.value = true;
  }
};

const getCurrentPos = (event: MouseEvent | TouchEvent) => {
  let clientLeft, clientTop;
  if (event instanceof TouchEvent) {
    const touch = getTouchPosition(event);
    clientLeft = touch.clientLeft;
    clientTop = touch.clientTop;
  } else {
    clientLeft = event.clientX;
    clientTop = event.clientY;
  }
  return {
    clientLeft,
    clientTop,
  };
};

const calcDragOffset = (event: MouseEvent | TouchEvent) => {
  const elementHeight = containerRef.value?.clientHeight ?? 0;
  const elementWidth = containerRef.value?.clientWidth ?? 0;

  const maxYOffset =
    (elementHeight * props.zoomScale - elementHeight) / (props.zoomScale * 2);

  const maxXOffset =
    (elementWidth * props.zoomScale - elementWidth) / (props.zoomScale * 2);

  let { clientLeft, clientTop } = getCurrentPos(event);

  const dx = (clientLeft - prevPosition.value.left) / props.zoomScale;
  const dy = (clientTop - prevPosition.value.top) / props.zoomScale;

  offset.value = {
    left: Math.min(maxXOffset, Math.max(offset.value.left + dx, -maxXOffset)),
    top: Math.min(maxYOffset, Math.max(offset.value.top + dy, -maxYOffset)),
  };

  prevPosition.value = { left: clientLeft, top: clientTop };
};

const drag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  calcDragOffset(event);
};

const handleMouseLeave = () => {
  if (props.trigger === "hover") {
    resetPosition();
  }
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  let { clientLeft, clientTop } = getCurrentPos(event);

  mouseDownPosition.value = { left: clientLeft, top: clientTop };
  prevPosition.value = { left: clientLeft, top: clientTop };

  if (!isZoomed.value && props.trigger === "hover") return;

  isDragging.value = true;
};

const stopDrag = (event: TouchEvent | MouseEvent) => {
  isDragging.value = false;

  let { clientLeft, clientTop } = getCurrentPos(event);

  if (props.trigger === "click" || event instanceof TouchEvent) {
    if (!isZoomed.value) {
      isZoomed.value = true;
    } else if (
      mouseDownPosition.value.left === clientLeft &&
      mouseDownPosition.value.top === clientTop
    ) {
      resetPosition();
    }
  }
};

const resetPosition = () => {
  isZoomed.value = false;
  offset.value = { left: 0, top: 0 };
};
</script>
