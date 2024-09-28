<template>
  <div
    class="relative h-[32rem] select-none overflow-clip border-none"
    ref="containerRef"
  >
    <img
      class="zoom-effect h-full w-full object-contain"
      ref="imgRef"
      alt="zoom-image"
      :src="red"
    />

    <div
      class="absolute left-0 top-0 h-full w-full bg-black/40"
      ref="backdropRef"
      @click="moveToCursor"
    >
      <div
        class="absolute h-1/2 w-1/2 bg-white/40 hover:cursor-pointer active:cursor-move"
        :class="{ '-z-10 opacity-0': !clickPosition }"
        ref="movableWindowRef"
        :style="{
          left: `${dragPosition?.left}px`,
          top: `${dragPosition?.top}px`,
        }"
        @mousedown="startMoving"
        @mouseup="stopMoving"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { computed, ref, useTemplateRef } from "vue";
import red from "~/assets/images/red.jpg";

/*
  1. adjust initail position of moving window to be in the middle
  2. make the window size dynamic related to amount of zoom
*/

const mouseHold = ref(false);
const clickPosition = ref<{ top: number; left: number }>();
const backdropRef = useTemplateRef("backdropRef");
const movableWindow = useTemplateRef("movableWindowRef");

const { elementX, elementY } = useMouseInElement(backdropRef);

const dragPosition = computed(() => {
  if (mouseHold.value) {
    return getMovableWindowNewPosition();
  } else {
    return clickPosition.value;
  }
});

// Adjust initial position
const moveToCursor = () => {
  console.log("in", movableWindow.value?.clientWidth);

  clickPosition.value = getMovableWindowNewPosition();
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
