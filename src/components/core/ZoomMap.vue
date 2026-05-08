<template>
  <div
    class="vz-map-container z-50 select-none overflow-clip"
    ref="zoomMap"
    :style="{
      width: `${mapSize.width}px`,
      height: `${mapSize.height}px`,
    }"
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

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    zoomScale?: number;
    ratio?: number;
    imgRef?: HTMLImageElement | null;
  }>(),
  {
    ratio: 0.25,
    zoomScale: 2,
    alt: "zoomed-img",
  },
);

const position = defineModel("position", {
  type: Object as PropType<PositionType>,
});

let resizeObserver: ResizeObserver | null = null;

const mouseHold = ref(false);
const backdropRef = useTemplateRef("zoomMap");
const movableWindowRef = useTemplateRef("movableWindow");

const mapSize = ref({ width: 0, height: 0 });

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

const updateMapSize = (imgEl: HTMLImageElement) => {
  mapSize.value = {
    width: Math.round(imgEl.clientWidth * props.ratio),
    height: Math.round(imgEl.clientHeight * props.ratio),
  };
};

const observeImgRef = (imgEl: HTMLImageElement | null | undefined) => {
  resizeObserver?.disconnect();
  if (!imgEl) return;

  updateMapSize(imgEl);

  resizeObserver = new ResizeObserver(([entry]) => {
    const { inlineSize, blockSize } = entry.contentBoxSize[0];
    mapSize.value = {
      width: Math.round(inlineSize * props.ratio),
      height: Math.round(blockSize * props.ratio),
    };
  });

  resizeObserver.observe(imgEl);
};

watchEffect(() => observeImgRef(props.imgRef));

onMounted(() => {
  if (backdropRef.value) {
    backdropRef.value.addEventListener("mousemove", updateCursorPosition);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();

  if (backdropRef.value) {
    backdropRef.value.removeEventListener("mousemove", updateCursorPosition);
  }
});

watchEffect(() => {
  if (mouseHold.value) {
    moveToCursor();
  }
});
</script>
