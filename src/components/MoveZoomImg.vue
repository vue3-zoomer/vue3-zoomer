<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    :style="{ cursor: cursorStyle }"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <img
      class="zoom-effect h-full w-full object-contain"
      ref="imgRef"
      alt="zoom-image"
      :src="src"
      :style="{
        transform: `translate(${left}px, ${top}px)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { PropType, ref, computed } from "vue";

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
    default: "hover",
  },
});

const imgRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
const left = ref(0);
const top = ref(0);
const isZoomed = ref(false);

const { elementX, elementY, elementHeight, elementWidth, isOutside } =
  useMouseInElement(containerRef);

const zoomIn = () => {
  if (imgRef.value) imgRef.value.style.scale = props.zoomScale.toString();
};

const zoomOut = () => {
  if (imgRef.value) imgRef.value.style.scale = "1";
  resetPosition();
};
const cursorStyle = computed(() => {
  return isZoomed.value ? "zoom-out" : "zoom-in";
});

const handleMouseEnter = () => {
  if (props.trigger === "hover") {
    isZoomed.value = true;
    zoomIn();
  }
};

const handleMouseLeave = () => {
  isZoomed.value = false;
  zoomOut();
};

const handleMouseMove = () => {
  if (!isOutside.value && isZoomed.value) {
    const xRatio =
      (elementX.value - elementWidth.value / 2) / (elementWidth.value / 2);
    const yRatio =
      (elementY.value - elementHeight.value / 2) / (elementHeight.value / 2);
    left.value = (-xRatio * elementWidth.value) / 4;
    top.value = (-yRatio * elementHeight.value) / 4;
  }
};

const handleClick = () => {
  if (props.trigger === "click") {
    if (!isZoomed.value) {
      zoomIn();
    } else {
      zoomOut();
    }
    isZoomed.value = !isZoomed.value;
  }
};

const resetPosition = () => {
  left.value = 0;
  top.value = 0;
};
</script>

<style scoped>
/* FIXME:  */
.zoom-effect {
  transition: scale;
}
</style>
