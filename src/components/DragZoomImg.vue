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

const prevPosition = ref({ x: 0, y: 0 });
const offset = ref({ left: 0, top: 0 });
const mouseDownPosition = ref({ x: 0, y: 0 });

const isZoomed = ref(false);
const isDragging = ref(false);

const scale = computed(() => (isZoomed.value ? props.zoomScale : 1));

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    isZoomed.value = true;
  }
};

const calculatePrevPosition = (event: MouseEvent | TouchEvent) => {
  prevPosition.value = {
    x: "clientX" in event ? event.clientX : event.touches[0].clientX,
    y: "clientY" in event ? event.clientY : event.touches[0].clientY,
  };
};

const calcDragOffset = (event: MouseEvent | TouchEvent) => {
  const elementHeight = containerRef.value?.clientHeight ?? 0;
  const elementWidth = containerRef.value?.clientWidth ?? 0;

  const maxYOffset =
    (elementHeight * props.zoomScale - elementHeight) / (props.zoomScale * 2);

  const maxXOffset =
    (elementWidth * props.zoomScale - elementWidth) / (props.zoomScale * 2);

  const clientX = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const clientY = "clientY" in event ? event.clientY : event.touches[0].clientY;

  const dx = (clientX - prevPosition.value.x) / props.zoomScale;
  const dy = (clientY - prevPosition.value.y) / props.zoomScale;

  offset.value = {
    left: Math.min(maxXOffset, Math.max(offset.value.left + dx, -maxXOffset)),
    top: Math.min(maxYOffset, Math.max(offset.value.top + dy, -maxYOffset)),
  };

  calculatePrevPosition(event);
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
  const { clientX, clientY } =
    event instanceof TouchEvent ? event.touches[0] : event;

  mouseDownPosition.value = { x: clientX, y: clientY };
  prevPosition.value = { x: clientX, y: clientY };

  if (!isZoomed.value && props.trigger === "hover") return;

  isDragging.value = true;
};

const stopDrag = (event: TouchEvent | MouseEvent) => {
  isDragging.value = false;

  let clientX, clientY;

  if (event instanceof TouchEvent) {
    const touch = event.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  if (props.trigger === "click" || event instanceof TouchEvent) {
    if (!isZoomed.value) {
      isZoomed.value = true;
    } else if (
      mouseDownPosition.value.x === clientX &&
      mouseDownPosition.value.y === clientY
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
