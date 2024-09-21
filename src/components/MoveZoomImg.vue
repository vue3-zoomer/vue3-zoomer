<template>
  <div
    class="cursor-zoom-in overflow-clip border-none"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
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

import { ref } from "vue";
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

const imgRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
const left = ref(0);
const top = ref(0);

const { elementX, elementY, elementHeight, elementWidth, isOutside } =
  useMouseInElement(containerRef);

const handleMouseEnter = () => {
  // console.log("enter");
  if (imgRef.value) imgRef.value.style.scale = props.zoomScale.toString();
};

const handleMouseLeave = () => {
  // console.log("leave");
  if (imgRef.value) imgRef.value.style.scale = "1";
  left.value = 0;
  top.value = 0;
};

const handleMouseMove = () => {
  // console.log("move");
  if (!isOutside.value) {
    const xRatio =
      (elementX.value - elementWidth.value / 2) / (elementWidth.value / 2);
    const yRatio =
      (elementY.value - elementHeight.value / 2) / (elementHeight.value / 2);
    left.value = (-xRatio * elementWidth.value) / 4;
    top.value = (-yRatio * elementHeight.value) / 4;
  }
};
</script>

<style scoped>
/* FIXME:  */
.zoom-effect {
  transition: scale;
}
</style>
