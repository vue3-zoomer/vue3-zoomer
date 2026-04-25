<template>
  <div
    class="vz-magnifier-img-container relative"
    ref="container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @wheel.prevent="handleWheel"
    @touchmove.prevent="handleTouchMove"
    @touchend="handleTouchEnd"
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
import { getRelTouchPosition } from "~/utils/touchPosition";
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
  resizeOnWheel: {
    type: Boolean,
    default: true,
  },
});

const containerRef = useTemplateRef("container");

const position = ref<PositionType>({ left: 0, top: 0 });
const isOutside = ref(true);
const magnifierSize = ref(props.size);

const magnifierRadius = computed(() => magnifierSize.value / 2);

const zoomedImgOffset = computed(() => {
  // Add half magnifier size to the position before converting to offset
  const pos = {
    left: position.value.left + magnifierRadius.value,
    top: position.value.top + magnifierRadius.value,
  };
  const offset = pos2offset(pos, props.zoomScale);

  // Remove the added size after conversion
  return {
    left: offset.left + magnifierRadius.value,
    top: offset.top + magnifierRadius.value,
  };
});

const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) return;

  const { pos, isOutside: outside } = getRelCursorPosition(
    event,
    containerRef.value,
  );
  isOutside.value = outside;

  if (!isOutside.value) {
    position.value = {
      left: pos.left - magnifierRadius.value,
      top: pos.top - magnifierRadius.value,
    };
  }
};

const handleMouseLeave = () => {
  isOutside.value = true;
};

const handleWheel = (event: WheelEvent) => {
  if (props.resizeOnWheel) {
    event.preventDefault();
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
  }
};

const handleTouchMove = (event: TouchEvent) => {
  if (!containerRef.value) return;

  const pos = getRelTouchPosition(event, containerRef.value);
  const { clientWidth: width, clientHeight: height } = containerRef.value;

  if (pos.left < 0 || pos.top < 0 || pos.left > width || pos.top > height) {
    isOutside.value = true;
    return;
  }

  isOutside.value = false;
  position.value = {
    left: Math.min(
      Math.max(pos.left - magnifierRadius.value, -magnifierRadius.value),
      width - magnifierRadius.value,
    ),
    top: Math.min(
      Math.max(pos.top - magnifierRadius.value, -magnifierRadius.value),
      height - magnifierRadius.value,
    ),
  };
};

const handleTouchEnd = () => {
  isOutside.value = true;
};
</script>

<style scoped src="../assets/css/main.css"></style>
