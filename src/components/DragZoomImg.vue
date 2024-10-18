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

const startDrag = (event: MouseEvent) => {
  if (props.trigger === "click") {
    mouseDownPosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  if (!isZoomed.value && props.trigger === "hover") return;

  isDragging.value = true;
  prevPosition.value = {
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

  const dx = (event.clientX - prevPosition.value.x) / props.zoomScale;
  const dy = (event.clientY - prevPosition.value.y) / props.zoomScale;

  offset.value = {
    left: Math.min(maxXOffset, Math.max(offset.value.left + dx, -maxXOffset)),
    top: Math.min(maxYOffset, Math.max(offset.value.top + dy, -maxYOffset)),
  };

  prevPosition.value = {
    x: event.clientX,
    y: event.clientY,
  };
};

const stopDrag = (event: MouseEvent) => {
  isDragging.value = false;

  if (props.trigger === "click") {
    if (!isZoomed.value) {
      isZoomed.value = true;
    } else if (
      mouseDownPosition.value.x === event.clientX &&
      mouseDownPosition.value.y === event.clientY
    ) {
      resetPosition();
    }
  }
};

const handleMouseLeave = () => {
  if (props.trigger === "hover") {
    resetPosition();
  }
};

const resetPosition = () => {
  isZoomed.value = false;
  offset.value = { left: 0, top: 0 };
};
</script>
