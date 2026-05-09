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
        hidden: (!loaded && $slots.loading) || (error && $slots.error),
      }"
      @error="handleError"
      @load="handleLoad"
    />

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
      class="absolute bottom-0 left-0 box-content border-8 border-transparent outline outline-2 outline-offset-[-8px] outline-white"
      ref="miniMap"
      :src="src"
      :ratio="imageMapRatio"
      :imgRef="zoomComponentRef?.vzImgRef"
      :zoom-scale="currentScale"
      :position="windowPosition"
      @update:position="updateOffset"
    />

    <FullScreenViewer
      v-if="fullScreenMode"
      v-model:is-open="isFullscreenOpen"
      :id="fullScreenId"
      :close-on-click-outside
      @close="emit('closeFullScreen')"
    >
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

    <slot
      v-if="fullScreenMode"
      name="full-screen-button"
      :open-full-screen="isFullscreenOpen"
    >
      <button class="open-button" @click="isFullscreenOpen = true" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { PositionType, ZoomImgProps } from "~/types";
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  useTemplateRef,
  onUpdated,
  useId,
} from "vue";
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
  imgMapRatio: 0.25,
});

const currentScale = ref(1);
const zoomedImgOffset = ref({ left: 0, top: 0 });
const screenSize = ref(1080);
const loaded = ref(false);
const error = ref(false);
const isFullscreenOpen = ref(false);
const position = ref({ x: 0, y: 0 });
const imageMapRatio = ref(props.imgMapRatio > 1 ? 1 : props.imgMapRatio);

const zoomComponentRef = useTemplateRef("zoomComponent");
const miniMapRef = useTemplateRef("miniMap");

const isDrag = computed(
  () => props.zoomType === "drag" || screenSize.value < 768,
);

const fullScreenId = useId();

let zoomPlaceholder: Comment | null = null;
let mapPlaceholder: Comment | null = null;

const moveToBackdrop = (
  el: HTMLElement | undefined,
  setPlaceholder: (c: Comment | null) => void,
) => {
  if (!el) return;
  const target = document.getElementById(`vz-backdrop-${fullScreenId}`);
  if (!target) return;
  const placeholder = document.createComment("");
  el.parentNode?.insertBefore(placeholder, el);
  target.appendChild(el);
  setPlaceholder(placeholder);
};

const restoreFromBackdrop = (
  el: HTMLElement | undefined,
  placeholder: Comment | null,
  setPlaceholder: (c: Comment | null) => void,
) => {
  if (!el || !placeholder) return;
  placeholder.parentNode?.replaceChild(el, placeholder);
  setPlaceholder(null);
};

const windowPosition = computed(() => {
  if (currentScale.value !== 1) {
    return offset2pos(
      zoomedImgOffset.value,
      currentScale.value / imageMapRatio.value,
    );
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
  if (newPosition)
    zoomedImgOffset.value = pos2offset(
      newPosition,
      currentScale.value / imageMapRatio.value,
    );
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

watch(
  () => props.fullScreenMode && isFullscreenOpen.value,
  async (active) => {
    await nextTick();
    const el = zoomComponentRef.value?.$el as HTMLElement | undefined;
    if (active) moveToBackdrop(el, (c) => (zoomPlaceholder = c));
    else restoreFromBackdrop(el, zoomPlaceholder, (c) => (zoomPlaceholder = c));
  },
);

watch(
  () =>
    props.showImgMap && props.showImgMapInFullScreen && isFullscreenOpen.value,
  async (active) => {
    await nextTick();
    const el = (miniMapRef.value as { $el?: HTMLElement } | null)?.$el;
    if (active) moveToBackdrop(el, (c) => (mapPlaceholder = c));
    else restoreFromBackdrop(el, mapPlaceholder, (c) => (mapPlaceholder = c));
  },
);

onBeforeUnmount(() => {
  const zEl = zoomComponentRef.value?.$el as HTMLElement | undefined;
  restoreFromBackdrop(zEl, zoomPlaceholder, (c) => (zoomPlaceholder = c));
  const mEl = (miniMapRef.value as { $el?: HTMLElement } | null)?.$el;
  restoreFromBackdrop(mEl, mapPlaceholder, (c) => (mapPlaceholder = c));
});

defineExpose({ currentScale, zoomComponentRef });
</script>

<style scoped src="../assets/css/main.css"></style>
