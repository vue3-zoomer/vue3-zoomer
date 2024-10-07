<template>
  <div
    ref="containerRef"
    class="h-full w-full overflow-hidden"
    :class="{
      'cursor-grab': isZoomed && !isDragging,
      'cursor-grabbing': isZoomed && isDragging,
      'cursor-zoom-in': !isZoomed,
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="startDrag"
    @mousemove="drag"
    @mouseup="stopDrag"
  >
    <img
      ref="imgRef"
      :src="src"
      alt="zoom-image"
      draggable="false"
      class="zoom-effect h-full w-full object-fill"
      :style="{
        transform: `scale(${scale}) translate(${offset.left}px, ${offset.top}px)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
});

const containerRef = ref<HTMLElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

const prevOffset = ref({ x: 0, y: 0 });
const offset = ref({ left: 0, top: 0 });

const isZoomed = ref(false);
const isDragging = ref(false);

const scale = computed(() => (isZoomed.value ? props.zoomScale : 1));

const handleMouseEnter = () => {
  isZoomed.value = true;
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  offset.value = { left: 0, top: 0 };
};

const startDrag = (event: MouseEvent) => {
  if (!isZoomed.value) return;

  isDragging.value = true;
  prevOffset.value = {
    x: event.clientX,
    y: event.clientY,
  };
};

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return;
  const elementHeight = containerRef.value?.clientHeight ?? 0;
  const elementWidth = containerRef.value?.clientWidth ?? 0;

  const maxYOffset =
    (elementHeight * props.zoomScale - elementHeight) / (props.zoomScale * 2);

  const maxXOffset =
    (elementWidth * props.zoomScale - elementWidth) / (props.zoomScale * 2);

  const dx = (event.clientX - prevOffset.value.x) / props.zoomScale;
  const dy = (event.clientY - prevOffset.value.y) / props.zoomScale;

  offset.value = {
    left: Math.min(maxXOffset, Math.max(offset.value.left + dx, -maxXOffset)),
    top: Math.min(maxYOffset, Math.max(offset.value.top + dy, -maxYOffset)),
  };

  prevOffset.value = {
    x: event.clientX,
    y: event.clientY,
  };
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>
