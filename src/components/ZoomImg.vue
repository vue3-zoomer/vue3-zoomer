<template>
  <div class="vz-zoomimg-container relative">
    <FullScreenViewer
      v-model:is-open="isFullscreenOpen"
      :enabled="fullScreenMode"
      :close-on-click-outside
      @close="emit('closeFullScreen')"
    >
      <component
        v-model:current-scale="currentScale"
        v-model:zoomed-img-offset="zoomedImgOffset"
        v-bind="props"
        ref="zoomComponent"
        class="h-full w-full"
        :alt
        :is="isDrag ? DragZoomImg : MoveZoomImg"
        :class="{
          hidden: (!loaded && $slots.loading) || (error && $slots.error),
        }"
        @error="handleError"
        @load="handleLoad"
      />

      <!-- Fullscreen Buttons -->
      <template #close-button>
        <slot name="close-button" :close="closeFullscreen" />
      </template>

      <template #full-screen-button>
        <slot name="full-screen-button" :open="openFullScreen" />
      </template>

      <template #controls>
        <slot
          name="controls"
          :current-scale
          :zoom-in="handleZoomIn"
          :zoom-out="handleZoomOut"
        />
      </template>
    </FullScreenViewer>

    <slot v-if="!loaded" name="loading" />
    <slot v-if="error" name="error" />

    <ZoomButtons
      v-if="showZoomBtns"
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="currentScale"
      v-bind="props"
      :max-zoom="currentScale === zoomScale"
      :min-zoom="currentScale === 1"
      @zoomIn="handleZoomIn"
      @zoomOut="handleZoomOut"
    />

    <ZoomMap
      v-if="showImgMap"
      v-show="windowPosition"
      class="absolute bottom-[28%] left-0 box-content h-[25%] w-[25%] border-8 border-transparent outline outline-2 outline-offset-[-8px] outline-white"
      :src="src"
      :zoom-scale="currentScale"
      :position="windowPosition"
      @update:position="updateOffset"
    />
  </div>
</template>

<script setup lang="ts">
import type { PositionType, ZoomImgProps } from "~/types";
import { ref, computed, onMounted, useTemplateRef, onUpdated } from "vue";
import { offset2pos, pos2offset } from "~/utils/zoom";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import ZoomButtons from "~/components/controls/ZoomButtons.vue";
import ZoomMap from "~/components/core/ZoomMap.vue";
import FullScreenViewer from "~/components/controls/FullScreenViewer.vue";

const emit = defineEmits(["error", "load", "closeFullScreen"]);
const props = withDefaults(defineProps<ZoomImgProps>(), {
  zoomType: "move",
  rotate: 0,
});

const currentScale = ref(1);
const zoomedImgOffset = ref({ left: 0, top: 0 });
const screenSize = ref(1080);
const loaded = ref(false);
const error = ref(false);
const isFullscreenOpen = ref(false);
const position = ref({ x: 0, y: 0 });

const zoomComponentRef = useTemplateRef("zoomComponent");

const isDrag = computed(
  () => props.zoomType === "drag" || screenSize.value < 768,
);

const windowPosition = computed(() => {
  if (currentScale.value !== 1) {
    // Multiply scale by 4 because the map window is quarter the map container
    return offset2pos(zoomedImgOffset.value, currentScale.value * 4);
  }
});

const handleZoomIn = () => {
  if (zoomComponentRef.value) {
    zoomComponentRef.value.zoomDir = "IN";
    zoomComponentRef.value.multiZoom();
  }
};

const handleZoomOut = () => {
  if (zoomComponentRef.value) {
    zoomComponentRef.value.zoomDir = "OUT";
    zoomComponentRef.value.multiZoom();
  }
};

const updateOffset = (newPosition?: PositionType) => {
  // Multiply scale by 4 because the map window is quarter the map container
  if (newPosition)
    zoomedImgOffset.value = pos2offset(newPosition, currentScale.value * 4);
};

const handleLoad = () => {
  loaded.value = true;
  emit("load");
};

const handleError = () => {
  error.value = true;
  emit("error");
};

const openFullScreen = () => {
  resetTransform();
  isFullscreenOpen.value = true;
};

const closeFullscreen = () => {
  emit("closeFullScreen");
  isFullscreenOpen.value = false;
};

const resetTransform = () => {
  currentScale.value = 1;
  position.value = { x: 0, y: 0 };
};

onMounted(() => {
  screenSize.value = window?.innerWidth ?? 1080;
  if (zoomComponentRef.value?.vzImgRef?.complete) {
    loaded.value = true;
  }
});

onUpdated(() => {
  if (!loaded.value)
    loaded.value = Boolean(zoomComponentRef.value?.vzImgRef?.complete);
});

defineExpose({
  currentScale,
  zoomComponentRef,
});
</script>

<style scoped src="../assets/css/main.css"></style>
