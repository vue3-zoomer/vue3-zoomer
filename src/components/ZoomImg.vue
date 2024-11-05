<template>
  <div>
    <MoveZoomImg
      v-if="zoomType === 'move'"
      v-model:current-scale="currentScale"
      v-bind="props"
      ref="zoomComponent"
      :persist="true"
    />
    <DragZoomImg
      v-else
      v-bind="props"
      v-model:current-scale="currentScale"
      ref="zoomComponent"
    />
    <ZoomButtons
      v-if="showAddSubBtn"
      :max-zoom="currentScale === zoomScale"
      :min-zoom="currentScale === 1"
      @zoomIn="handleZoomIn"
      @zoomOut="handleZoomOut"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, useTemplateRef } from "vue";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import ZoomButtons from "~/components/controls/ZoomButtons.vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
  trigger: {
    type: String as PropType<"click" | "hover">,
    default: "click",
  },
  zoomType: {
    type: String as PropType<"move" | "drag">,
    default: "move",
  },
  step: {
    type: Number,
  },
  persist: {
    type: Boolean,
  },
  showAddSubBtn: {
    type: Boolean,
    default: true,
  },
});

const zoomComponent = useTemplateRef("zoomComponent");
const currentScale = ref(1);

const handleZoomIn = () => {
  if (zoomComponent.value) {
    zoomComponent.value.zoomDir = "IN";
    zoomComponent.value.multiZoom();
  }
};

const handleZoomOut = () => {
  if (zoomComponent.value) {
    zoomComponent.value.zoomDir = "OUT";
    zoomComponent.value.multiZoom();
  }
};
</script>
