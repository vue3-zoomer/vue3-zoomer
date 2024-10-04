<template>
  <div
    class="relative h-full w-full select-none overflow-clip border-none"
    ref="containerRef"
  >
    <img
      class="zoom-effect h-full w-full object-fill"
      ref="imgRef"
      alt="zoom-image"
      :src="src"
    />

    <div
      class="absolute left-0 top-0 h-full w-full bg-black/40"
      ref="backdropRef"
      @click="moveToCursor"
    >
      <div
        class="absolute bg-white/40 hover:cursor-pointer active:cursor-move"
        ref="movableWindowRef"
        :class="{ '-z-10 opacity-0': !position }"
        :style="{
          left: `${currentPosition?.left}px`,
          top: `${currentPosition?.top}px`,
          width: `${(1 / zoomScale) * 100}%`,
          height: `${(1 / zoomScale) * 100}%`,
        }"
        @mousedown="startMoving"
        @mouseup="stopMoving"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { computed, PropType, ref, useTemplateRef } from "vue";
import { PositionType } from "~/types";

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

const { elementX, elementY } = useMouseInElement(backdropRef);

const currentPosition = computed(() => {
  if (mouseHold.value) {
    moveToCursor();
    return position.value;
  } else {
    return position.value;
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
    const maxleft =
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
      maxleft,
    );
    return {
      top,
      left,
    };
  } else {
    console.error("couldn't get movable window new position");
  }
};
</script>
