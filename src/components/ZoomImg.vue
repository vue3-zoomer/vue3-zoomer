<template>
  <div class="vz-zoomimg-container relative">
    <component
      v-model:current-scale="currentScale"
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-bind="props"
      ref="zoomComponent"
      class="h-full w-full"
      :alt
      :is="isDrag ? DragZoomImg : MoveZoomImg"
      :class="{
        hidden: isLoading || (error && $slots.error),
      }"
      @error="handleError"
      @load="handleLoad"
    />

    <slot v-if="isLoading" name="loading" />
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
import { ref, computed, onMounted, useSlots, useTemplateRef } from "vue";
import { offset2pos, pos2offset } from "~/utils/zoom";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import ZoomButtons from "~/components/controls/ZoomButtons.vue";
import ZoomMap from "~/components/core/ZoomMap.vue";

const emit = defineEmits(["error", "load"]);
const props = withDefaults(defineProps<ZoomImgProps>(), {
  zoomType: "move",
});

const currentScale = ref(1);
const zoomedImgOffset = ref({ left: 0, top: 0 });
const screenSize = ref(1080);
const loaded = ref(false);
const error = ref(false);
const isClient = ref(false);

const slots = useSlots();
const zoomComponentRef = useTemplateRef("zoomComponent");

const isDrag = computed(
  () => props.zoomType === "drag" || screenSize.value < 768,
);

const isLoading = computed(() => {
  if (props.loading) {
    return !!slots.loading;
  } else {
    return (!isClient.value || !loaded.value) && !!slots.loading;
  }
});

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

onMounted(() => {
  screenSize.value = window?.innerWidth ?? 1080;
  isClient.value = true;
});
</script>
