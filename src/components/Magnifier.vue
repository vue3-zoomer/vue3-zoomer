<template>
  <div
    class="relative"
    ref="containerRef"
    @mousemove="handleMouseMove"
    @wheel="handleWheel"
  >
    <img class="h-full w-full object-fill" alt="image" :src="src" />
    <div
      class="absolute z-10 overflow-clip rounded-full"
      :class="{ 'opacity-20': !test, hidden: isOutside }"
      :style="{
        boxShadow: 'inset 0 0 20px 1px #0000004d',
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${magnifierSize}px`,
        height: `${magnifierSize}px`,
      }"
      @click="test = !test"
    >
      <img
        class="h-full w-full object-fill"
        alt="zoom-image"
        :src="src"
        :style="{
          transform: `translate(${zoomedImgOffset.left}px, ${zoomedImgOffset.top}px) scaleX(${(zoomScale * elementWidth) / magnifierSize}) scaleY(${(zoomScale * elementHeight) / magnifierSize})`,
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

const containerRef = useTemplateRef("containerRef");

const test = ref(true);
const position = ref<PositionType>({ left: 0, top: 0 });

const { elementWidth, elementHeight, isOutside } =
  useMouseInElement(containerRef);

const magnifierSize = ref(200);

const zoomedImgOffset = computed(() => {
  return {
    left: -(
      (position.value.left + magnifierSize.value / 2) * props.zoomScale -
      magnifierSize.value / 2
    ),
    top: -(
      (position.value.top + magnifierSize.value / 2) * props.zoomScale -
      magnifierSize.value / 2
    ),
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
      elementWidth.value / 12,
      magnifierSize.value - 10,
    );
  } else {
    magnifierSize.value = Math.min(
      elementWidth.value / 1.5,
      magnifierSize.value + 10,
    );
  }
};
</script>
