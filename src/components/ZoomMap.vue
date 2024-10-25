<template>
  <div
    class="relative select-none overflow-clip"
    ref="backdropRef"
    @click="moveToCursor"
  >
    <img
      class="h-full w-full object-fill"
      ref="imgRef"
      alt="zoom-image"
      :src="src"
    />

    <div
      class="absolute bg-white/20 hover:cursor-pointer active:cursor-move"
      ref="movableWindowRef"
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
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";
import { PositionType } from "~/types";
import { getCursorPosition } from "~/utils/cursorPosition";

defineProps({
  src: {
    type: String,
    required: true,
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
const backdropRef = useTemplateRef("backdropRef");
const movableWindow = useTemplateRef("movableWindowRef");

// Store the elementX and elementY as reactive values
const elementX = ref(0);
const elementY = ref(0);

// Mousemove listener to track cursor position within the element
const updateCursorPosition = (event: MouseEvent) => {
  if (backdropRef.value) {
    const { relativeX, relativeY } = getCursorPosition(
      event,
      backdropRef.value,
    );
    elementX.value = relativeX;
    elementY.value = relativeY;
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
  if (backdropRef.value && movableWindow.value) {
    const maxTop =
      backdropRef.value?.clientHeight - movableWindow.value?.clientHeight;
    const maxLeft =
      backdropRef.value?.clientWidth - movableWindow.value?.clientWidth;

    const top = Math.min(
      Math.max(
        elementY.value - Number(movableWindow.value?.clientHeight) / 2,
        0,
      ),
      maxTop,
    );

    const left = Math.min(
      Math.max(
        elementX.value - Number(movableWindow.value?.clientWidth) / 2,
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
