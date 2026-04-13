<template>
  <Teleport v-if="enabled && isOpen" to="body">
    <div
      v-if="isOpen"
      class="vz-full-screen-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      @click.self="closeOnClickOutside && close()"
    >
      <!-- Main Image Container -->
      <slot />

      <!-- Close Button Slot -->
      <div
        class="vz-full-screen-close-button-container absolute right-0 top-0 z-10 p-6"
      >
        <slot name="close-button">
          <button class="close-button" @click="close"></button>
        </slot>
      </div>

      <!-- Controls Slot -->
      <div
        class="vz-full-controls-container absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent p-4"
      >
        <slot name="controls" />
      </div>
    </div>
  </Teleport>
  <template v-else>
    <slot></slot>

    <slot v-if="enabled" name="full-screen-button" :open-full-screen="isOpen">
      <button class="open-button" @click="isOpen = true" />
    </slot>
  </template>
</template>

<script setup lang="ts">
defineProps<{
  enabled?: boolean;
  closeOnClickOutside?: boolean;
}>();

const isOpen = defineModel<boolean>("is-open");

const emit = defineEmits<{
  close: [];
}>();

const close = () => {
  isOpen.value = false;
  emit("close");
};
</script>

<style scoped>
.fullscreen-btn {
  @apply flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm duration-200 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50;
}

.fullscreen-btn.floating {
  @apply bg-white/90 text-gray-800 shadow-lg hover:bg-white;
}

.close-button {
  @apply flex h-8 w-8 items-center justify-center rounded-sm bg-white/50 p-1 shadow-md hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30;
  content: url("~/assets/icons/close.svg");
}

.open-button {
  @apply absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-sm bg-white/50 p-1 shadow-md hover:bg-white/70 disabled:cursor-not-allowed disabled:bg-white/30;
  content: url("~/assets/icons/fullscreen.svg");
}
</style>
