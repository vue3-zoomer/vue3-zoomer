<template>
  <div
    class="vz-zoomimg-img-container cursor-zoom-in overflow-clip border-none"
    ref="container"
    :style="{ cursor: zoomDir === 'OUT' ? 'zoom-out' : 'zoom-in' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <img
      class="vz-zoomimg-img h-full w-full object-fill"
      :alt
      :src="src"
      :style="{
        transform: `translate(${zoomedImgOffset.left}px, ${zoomedImgOffset.top}px) scale(${currentScale})`,
        transformOrigin: '0 0',
        transition: isTransition ? 'transform 100ms ease-in-out' : 'none',
      }"
      @error="$emit('error')"
      @load="$emit('load')"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed, useTemplateRef } from "vue";
import { getRelCursorPosition } from "~/utils/cursorPosition";
import { calZoomedImgOffset } from "~/utils/zoom";
import { useTransition } from "~/composables/useTransition";
import useMultiZoom from "~/composables/useMultiZoom";

defineEmits(["error", "load"]);

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
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
  persist: {
    type: Boolean,
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

const isZoomed = computed(() => currentScale.value > 1);

const containerRef = useTemplateRef("container");

const { isTransition, startTransition } = useTransition();
const { zoomDir, multiStepZoomIn } = useMultiZoom(
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
  if (props.persist) return;
  resetPosition();
};

const handleClick = (event: MouseEvent) => {
  const { pos: relPos } = getRelCursorPosition(event, containerRef.value);
  startTransition();
  multiStepZoomIn(currentScale.value, relPos, props.step ?? props.zoomScale);
};

const handleMouseMove = (event: MouseEvent) => {
  const { pos: cursorPosition, isOutside } = getRelCursorPosition(
    event,
    containerRef.value,
  );

  if (!isOutside && isZoomed.value && !isTransition.value) {
    zoomedImgOffset.value = calZoomedImgOffset(
      cursorPosition,
      containerRef.value,
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
  zoomDir.value = "IN";
};

defineExpose({
  zoomDir,
  multiZoom: () => {
    const rect = containerRef.value?.getBoundingClientRect();
    if (rect) {
      handleClick({
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
      } as MouseEvent);
    }
  },
});
</script>
