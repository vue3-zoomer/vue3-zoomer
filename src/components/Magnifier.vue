<template>
  <div
    class="vz-magnifier-img-container relative"
    ref="container"
    @mousemove="handleMouseMove"
    @wheel.prevent="handleWheel"
    @touchmove.prevent="handleTouchMove"
  >
    <img
      class="vz-magnifier-img h-full w-full object-fill"
      :alt
      :src="src"
      @error="$emit('error')"
      @load="$emit('load')"
    />

    <div
      v-show="!isOutside"
      class="vz-magnifier-lens absolute z-10 overflow-clip rounded-full shadow-inner-lg hover:cursor-none"
      :style="{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${magnifierSize}px`,
        height: `${magnifierSize}px`,
      }"
    >
      <img
        class="vz-magnifier-lens-img h-full w-full object-fill"
        alt="lens-zoomed-image"
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
import { ref, computed, useTemplateRef } from "vue";
import { getRelCursorPosition } from "~/utils/cursorPosition";
import { getAbsTouchPosition } from "~/utils/touchPosition";
import { pos2offset } from "~/utils/zoom";

defineEmits(["error", "load"]);

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "zoomed-img",
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
  size: {
    type: Number,
    default: 200,
  },
});

const containerRef = useTemplateRef("container");

const position = ref<PositionType>({ left: 0, top: 0 });
const isOutside = ref(true);
const magnifierSize = ref(props.size);

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
  if (containerRef.value) {
    const { pos, isOutside: outside } = getRelCursorPosition(
      event,
      containerRef.value,
    );

    isOutside.value = outside;

    if (!isOutside.value) {
      // Update position for the magnifier
      position.value = {
        left: pos.left - magnifierSize.value / 2,
        top: pos.top - magnifierSize.value / 2,
      };
    }
  }
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

const handleTouchMove = (event: TouchEvent) => {
  const containerRect = containerRef.value?.getBoundingClientRect() as DOMRect;
  const touch = getAbsTouchPosition(event);
  position.value = {
    left: touch.left - containerRect.left - magnifierSize.value / 2,
    top: touch.top - containerRect.top - magnifierSize.value / 2,
  };
};
</script>
