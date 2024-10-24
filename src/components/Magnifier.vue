<template>
  <div
    class="relative"
    ref="containerRef"
    @mousemove="handleMouseMove"
    @wheel="handleWheel"
  >
    <img class="h-full w-full object-fill" alt="image" :src="src" />
    <div
      class="absolute z-10 overflow-clip rounded-full hover:cursor-none"
      :class="{ hidden: isOutside }"
      :style="{
        boxShadow: 'inset 0 0 20px 1px #0000004d',
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${magnifierSize}px`,
        height: `${magnifierSize}px`,
      }"
    >
      <img
        class="h-full w-full object-fill"
        alt="zoom-image"
        :src="src"
        :style="{
          transform: `translate(${zoomedImgOffset.left}px, ${zoomedImgOffset.top}px) scaleX(${(zoomScale * (containerRef?.clientWidth ?? 1)) / magnifierSize}) scaleY(${(zoomScale * (containerRef?.clientHeight ?? 1)) / magnifierSize})`,
          transformOrigin: '0 0',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PositionType } from "~/types";
import { computed, ref, useTemplateRef } from "vue";
import { useMouseInElement } from "@vueuse/core";
import { pos2offset } from "~/utilities/zoomCalculations";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
  magnifierInitialSize: {
    type: Number,
    default: 200,
  },
});

const containerRef = useTemplateRef("containerRef");

const position = ref<PositionType>({ left: 0, top: 0 });

const { isOutside } = useMouseInElement(containerRef);

const magnifierSize = ref(props.magnifierInitialSize);

const zoomedImgOffset = computed(() => {
  // Add half magnifier size to the position before converting to offset
  const pos = {
    left: position.value.left + magnifierSize.value / 2,
    top: position.value.top + magnifierSize.value / 2,
  };
  const offset = pos2offset(pos, props.zoomScale);

  // Remove the added size after conversion
  return {
    left: offset.left + magnifierSize.value / 2,
    top: offset.top + magnifierSize.value / 2,
  };
});

const handleMouseMove = (event: MouseEvent) => {
  const containerRect = containerRef.value?.getBoundingClientRect() as DOMRect;

  position.value = {
    left: event.clientX - containerRect?.left - magnifierSize.value / 2,
    top: event.clientY - containerRect?.top - magnifierSize.value / 2,
  };
};

const handleWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    magnifierSize.value = Math.max(
      (containerRef.value?.clientWidth ?? 1) / 12,
      magnifierSize.value - 10,
    );
  } else {
    magnifierSize.value = Math.min(
      (containerRef.value?.clientWidth ?? 1) / 1.5,
      magnifierSize.value + 10,
    );
  }
};
</script>
