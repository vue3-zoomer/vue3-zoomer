<template>
  <MoveZoomImg v-if="zoomType === 'move'" v-bind="props" />
  <DragZoomImg v-else v-bind="props" />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";

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
});
</script>
