<template>
  <div class="absolute bottom-1 end-1 z-10 flex gap-2 p-3">
    <button
      class="controls-btn zoom-out-btn"
      :disabled="minZoom"
      @click="$emit('zoomOut')"
    />

    <button
      class="controls-btn zoom-in-btn"
      :disabled="maxZoom"
      @click="$emit('zoomIn')"
    />
  </div>
</template>

<script setup lang="ts">
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

defineEmits(["zoomIn", "zoomOut"]);
</script>

<style scoped>
.controls-btn {
  @apply flex h-8 w-8 items-center justify-center rounded-sm bg-white/50 shadow-md hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30;
}

.zoom-out-btn {
  content: url("~/assets/icons/minus.svg");
}

.zoom-in-btn {
  content: url("~/assets/icons/plus.svg");
}
</style>
