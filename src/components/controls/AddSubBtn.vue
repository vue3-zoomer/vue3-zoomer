<template>
  <div class="relative flex">
    <div
      class="absolute bottom-1 z-10 flex w-full items-center justify-end gap-2 p-3"
    >
      <button :disabled="minZoom" :class="buttonClass" @click="handleZoomOut">
        <slot>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 12H6"
            />
          </svg>
        </slot>
      </button>

      <button :disabled="maxZoom" :class="buttonClass" @click="handleZoomIn">
        <slot>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </slot>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
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

const buttonClass = computed(
  () =>
    "flex h-8 w-8 items-center justify-center rounded-sm bg-white/50 shadow-md hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30",
);
</script>
