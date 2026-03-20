<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="closeFullscreen"
        @keydown.esc="closeFullscreen"
      >
        <!-- Main Image Container -->
        <slot />

        <!-- Toolbar -->
        <!-- Close Button Slot -->
        <slot
          v-if="closeButton"
          name="close-button"
          :close-fullscreen="closeFullscreen"
        >
          <button
            class="absolute right-0 top-0 z-10 p-6 text-white transition-colors hover:text-gray-300"
            @click="closeFullscreen"
          >
            <img
              src="/src/assets/icons/close.svg"
              alt="Close"
              class="h-6 w-6"
            />
          </button>
        </slot>

        <!-- Default Controls Toolbar -->
        <slot
          name="fullscreen-controls"
          :zoom-scale
          :current-scale
          :rotation
          :position
          :zoom-in="zoomIn"
          :zoom-out="zoomOut"
          :rotate-left="rotateLeft"
          :rotate-right="rotateRight"
          :reset-transform="resetTransform"
          :close-fullscreen="closeFullscreen"
        >
          <div
            class="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent p-4"
          >
            <button
              class="fullscreen-btn"
              :disabled="currentScale <= 1"
              @click="zoomOut"
            >
              <img
                src="/src/assets/icons/minus.svg"
                alt="Zoom out"
                class="h-5 w-5"
              />
            </button>
            <button
              class="fullscreen-btn"
              :disabled="currentScale >= zoomScale"
              @click="zoomIn"
            >
              <img
                src="/src/assets/icons/plus.svg"
                alt="Zoom in"
                class="h-5 w-5"
              />
            </button>
          </div>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  isOpen: boolean;
  src: string;
  alt?: string;
  zoomScale?: number;
  closeButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  zoomScale: 3,
});

const emit = defineEmits<{
  close: [];
}>();

// State
const currentScale = ref(1);
const rotation = ref(0);
const position = ref({ x: 0, y: 0 });

// Methods
const closeFullscreen = () => {
  emit("close");
};

const zoomIn = () => {
  currentScale.value = Math.min(currentScale.value + 0.5, props.zoomScale);
};

const zoomOut = () => {
  currentScale.value = Math.max(currentScale.value - 0.5, 1);
};

const rotateLeft = () => {
  rotation.value -= 90;
};

const rotateRight = () => {
  rotation.value += 90;
};

const resetTransform = () => {
  currentScale.value = 1;
  rotation.value = 0;
  position.value = { x: 0, y: 0 };
};

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;

  switch (event.key) {
    case "Escape":
      closeFullscreen();
      break;
    case "+":
    case "=":
      zoomIn();
      break;
    case "-":
    case "_":
      zoomOut();
      break;
    case "ArrowLeft":
    case "ArrowUp":
      rotateLeft();
      break;
    case "ArrowRight":
    case "ArrowDown":
      rotateRight();
      break;
    case "r":
    case "R":
      resetTransform();
      break;
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.fullscreen-btn {
  @apply flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50;
}

.fullscreen-btn.floating {
  @apply bg-white/90 text-gray-800 shadow-lg hover:bg-white;
}
</style>
