<template>
  <div
    class="vz-map-container relative select-none overflow-clip"
    ref="backdrop"
    @click="moveToCursor"
    @mouseleave="stopMoving"
  >
    <img
      class="vz-map-img h-full w-full object-fill"
      ref="imgRef"
      :alt
      :src="src"
    />

    <div
      class="vz-map-window absolute bg-white/20 hover:cursor-pointer active:cursor-move"
      ref="movableWindow"
      :class="{ 'invisible -z-10': !position }"
      :style="{
        left: `${position?.left}px`,
        top: `${position?.top}px`,
        width: `${(1 / zoomScale) * 100}%`,
        height: `${(1 / zoomScale) * 100}%`,
      }"
      @mousedown="startMoving"
      @mouseup="stopMoving"
    />
  </div>
</template>

<script setup lang="ts">
import {
  type PropType,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";
import type { PositionType } from "~/types";
import { getRelCursorPosition } from "~/utils/cursorPosition";

defineProps({
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
});

const position = defineModel("position", {
  type: Object as PropType<PositionType>,
});

const mouseHold = ref(false);
const backdropRef = useTemplateRef("backdrop");
const movableWindowRef = useTemplateRef("movableWindow");

// Store the elementX and elementY as reactive values
const elementX = ref(0);
const elementY = ref(0);

// Mousemove listener to track cursor position within the element
const updateCursorPosition = (event: MouseEvent) => {
  if (backdropRef.value) {
    const { pos } = getRelCursorPosition(event, backdropRef.value);
    elementX.value = pos.left;
    elementY.value = pos.top;
  }
};

onMounted(() => {
  if (backdropRef.value) {
    backdropRef.value.addEventListener("mousemove", updateCursorPosition);
  }
});

onBeforeUnmount(() => {
  if (backdropRef.value) {
    backdropRef.value.removeEventListener("mousemove", updateCursorPosition);
  }
});

watchEffect(() => {
  if (mouseHold.value) {
    moveToCursor();
  }
});

const moveToCursor = () => {
  position.value = getMovableWindowNewPosition();
};

const startMoving = () => {
  mouseHold.value = true;
};

const stopMoving = () => {
  mouseHold.value = false;
};

const getMovableWindowNewPosition = () => {
  if (backdropRef.value && movableWindowRef.value) {
    const maxTop =
      backdropRef.value?.clientHeight - movableWindowRef.value?.clientHeight;
    const maxLeft =
      backdropRef.value?.clientWidth - movableWindowRef.value?.clientWidth;

    const top = Math.min(
      Math.max(
        elementY.value - Number(movableWindowRef.value?.clientHeight) / 2,
        0,
      ),
      maxTop,
    );

    const left = Math.min(
      Math.max(
        elementX.value - Number(movableWindowRef.value?.clientWidth) / 2,
        0,
      ),
      maxLeft,
    );
    return { top, left };
  } else {
    console.error("couldn't get movable window new position");
  }
};
</script>
