<template>
  <div class="relative flex">
    <div
      class="absolute bottom-1 z-10 flex w-full items-center justify-end gap-2 px-3 py-2"
    >
      <slot>
        <button
          :disabled="minZoom"
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 shadow-md hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30"
          @click="handleZoomOut"
        >
          <span class="h-full w-fit text-xl"> - </span>
        </button>
      </slot>

      <slot>
        <button
          :disabled="maxZoom"
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 shadow-md transition hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30"
          @click="handleZoomIn"
        >
          <span class="h-full w-fit text-xl"> + </span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(["zoomIn", "zoomOut"]);

defineProps({
  maxZoom: {
    type: Boolean,
    required: true,
  },
  minZoom: {
    type: Boolean,
    required: true,
  },
});

const handleZoomIn = () => {
  emit("zoomIn");
};

const handleZoomOut = () => {
  emit("zoomOut");
};
</script>
