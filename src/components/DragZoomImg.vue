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
      class="zoom-effect h-full w-full object-contain"
      :style="{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMouseInElement } from "@vueuse/core";

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

const dragStart = ref({ x: 0, y: 0 });
const position = ref({ x: 0, y: 0 });

const isZoomed = ref(false);
const isDragging = ref(false);

const { elementPositionX, elementPositionY } = useMouseInElement(containerRef);

const scale = computed(() => (isZoomed.value ? props.zoomScale : 1));

const maxX = computed(() => Math.max(0, elementPositionX.value));
const maxY = computed(() => Math.max(0, elementPositionY.value));

const handleMouseEnter = () => {
  isZoomed.value = true;
  position.value = { x: 0, y: 0 };
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  isDragging.value = false;
  position.value = { x: 0, y: 0 };
};

const startDrag = (event: MouseEvent) => {
  if (isZoomed.value) {
    isDragging.value = true;
    dragStart.value = {
      x: event.clientX - position.value.x,
      y: event.clientY - position.value.y,
    };
  }
};

const drag = (event: MouseEvent) => {
  if (isDragging.value) {
    const newX = event.clientX - dragStart.value.x;
    const newY = event.clientY - dragStart.value.y;

    position.value = {
      x: Math.max(Math.min(newX, maxX.value), -maxX.value),
      y: Math.max(Math.min(newY, maxY.value), -maxY.value),
    };
  }
};

const stopDrag = () => {
  isDragging.value = false;
};
</script>

<style scoped>
.zoom-effect {
  transition: transform 200ms;
}
</style>
