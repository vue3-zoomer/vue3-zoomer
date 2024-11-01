<template>
  <div class="w-1/2">
    <MoveZoomImg
      v-if="zoomType === 'move'"
      v-model:current-scale="currentScale"
      v-bind="props"
      ref="exposeMove"
      :persist="true"
      @zoomIn="handleZoomIn"
      @zoomOut="handleZoomOut"
    />
    <DragZoomImg
      v-else
      v-bind="props"
      v-model:current-scale="currentScale"
      ref="exposeMove"
      @zoomIn="handleZoomIn"
      @zoomOut="handleZoomOut"
    />
    <AddSubBtn
      v-if="showAddSubBtn"
      :max-zoom="currentScale === zoomScale"
      :min-zoom="currentScale === 1"
      @zoomIn="handleZoomIn"
      @zoomOut="handleZoomOut"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, useTemplateRef } from "vue";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import AddSubBtn from "./controls/AddSubBtn.vue";

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

const exposeMove = useTemplateRef("exposeMove");
const currentScale = ref(1);

const handleZoomIn = () => {
  if (exposeMove.value) {
    exposeMove.value.zoomDir = "IN";
    exposeMove.value.multiZoom();
  }
};

const handleZoomOut = () => {
  if (exposeMove.value) {
    exposeMove.value.zoomDir = "OUT";
    exposeMove.value.multiZoom();
  }
};
</script>
