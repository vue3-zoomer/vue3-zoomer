<template>
  <div class="space-y-8">
    <!-- Basic Fullscreen with Default Slots -->
    <div>
      <h3 class="mb-4 text-lg font-semibold">
        Basic Fullscreen (Default Slots)
      </h3>
      <ZoomImg
        class="h-[20rem] rounded-lg border"
        alt="Basic fullscreen with default slots"
        zoom-type="drag"
        :src="imageSrc"
        :zoom-scale="3"
        fullscreen-mode
        close-button
      />
    </div>

    <!-- Custom Fullscreen Button -->
    <div>
      <h3 class="mb-4 text-lg font-semibold">Custom Fullscreen Button</h3>
      <ZoomImg
        class="h-[20rem] rounded-lg border"
        zoom-type="drag"
        :src="imageSrc"
        :zoom-scale="3"
        fullscreen-mode
        close-button
        alt="Custom fullscreen button"
      >
        <template #fullscreen-button="{ openFullscreen }">
          <button class="custom-fullscreen-btn" @click="openFullscreen">
            <img
              src="/src/assets/icons/fullscreen.svg"
              alt="Fullscreen"
              class="mr-2 h-4 w-4"
            />
            Open Fullscreen
          </button>
        </template>
      </ZoomImg>
    </div>

    <!-- Custom Controls -->
    <div>
      <h3 class="mb-4 text-lg font-semibold">Custom Controls</h3>
      <ZoomImg
        class="h-[20rem] rounded-lg border"
        zoom-type="drag"
        :src="imageSrc"
        :zoom-scale="3"
        fullscreen-mode
        close-button
        alt="Custom controls"
      >
        <template
          #fullscreen-controls="{ closeFullscreen, rotateLeft, rotateRight }"
        >
          <div
            class="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-2 bg-gradient-to-t from-black/50 to-transparent p-4"
          >
            <button class="control-btn" @click="rotateLeft">
              <img
                src="/src/assets/icons/rotate.svg"
                alt="Rotate left"
                class="h-5 w-5 scale-x-[-1]"
              />
            </button>
            <button class="control-btn" @click="rotateRight">
              <img
                src="/src/assets/icons/rotate.svg"
                alt="Rotate right"
                class="h-5 w-5"
              />
            </button>

            <button @click="closeFullscreen" class="control-btn close-btn">
              <img
                src="/src/assets/icons/close.svg"
                alt="Close"
                class="h-4 w-4"
              />
            </button>
          </div>
        </template>
      </ZoomImg>
    </div>

    <!-- Floating Buttons -->
    <div>
      <h3 class="mb-4 text-lg font-semibold">Floating Buttons</h3>
      <ZoomImg
        class="h-[20rem] rounded-lg border"
        zoom-type="drag"
        :src="imageSrc"
        :zoom-scale="3"
        fullscreen-mode
        alt="Floating buttons"
      >
        <template
          #fullscreen-controls="{
            currentScale,
            zoomIn,
            zoomOut,
            closeFullscreen,
          }"
        >
          <!-- Download button - top left -->
          <button
            class="floating-btn top-left bg-white/90 hover:bg-white"
            @click="downloadImage"
          >
            Download
          </button>

          <!-- Share button - top right -->
          <button
            class="floating-btn top-right bg-white/90 hover:bg-white"
            @click="shareImage"
          >
            Share
          </button>

          <!-- Custom zoom controls - bottom right -->
          <div class="floating-zoom bottom-right">
            <button
              @click="zoomOut"
              :disabled="currentScale <= 1"
              class="mini-btn"
            >
              <img
                src="/src/assets/icons/minus.svg"
                alt="Zoom Out"
                class="h-4 w-4"
              />
            </button>
            <span class="zoom-text">{{ Math.round(currentScale * 100) }}%</span>
            <button
              @click="zoomIn"
              :disabled="currentScale >= 3"
              class="mini-btn"
            >
              <img
                src="/src/assets/icons/plus.svg"
                alt="Zoom In"
                class="h-4 w-4"
              />
            </button>
          </div>

          <button
            class="floating-btn bottom-left bg-red-500"
            @click="closeFullscreen"
          >
            <img
              src="/src/assets/icons/close.svg"
              alt="Close"
              class="h-4 w-4"
            />
          </button>
        </template>
      </ZoomImg>
    </div>

    <!-- All Custom Slots -->
    <div>
      <h3 class="mb-4 text-lg font-semibold">Fully Customized</h3>
      <ZoomImg
        class="h-[20rem] rounded-lg border"
        zoom-type="drag"
        :src="imageSrc"
        :zoom-scale="3"
        fullscreen-mode
        close-button
        alt="Fully customized fullscreen"
      >
        <template #fullscreen-button="{ openFullscreen }">
          <button class="luxury-fullscreen-btn" @click="openFullscreen">
            <img
              src="/src/assets/icons/fullscreen.svg"
              alt="View in HD"
              class="h-5 w-5"
            />
            View in HD
          </button>
        </template>

        <template #close-button="{ closeFullscreen }">
          <button class="luxury-close-btn" @click="closeFullscreen">
            <img
              src="/src/assets/icons/close.svg"
              alt="Exit"
              class="mr-2 h-5 w-5"
            />
            Exit
          </button>
        </template>

        <template
          #fullscreen-controls="{
            zoomIn,
            zoomOut,
            rotateLeft,
            rotateRight,
            resetTransform,
            closeFullscreen,
            currentScale,
          }"
        >
          <div class="luxury-controls">
            <div class="luxury-info">
              <span class="zoom-level"
                >{{ Math.round(currentScale * 100) }}%</span
              >
              <span class="separator">|</span>
              <span class="action-text">Use mouse wheel to zoom</span>
            </div>
            <div class="luxury-buttons">
              <button @click="zoomIn" class="luxury-btn">Zoom In</button>
              <button @click="zoomOut" class="luxury-btn">Zoom Out</button>
              <button @click="rotateLeft" class="luxury-btn">
                Rotate Left
              </button>
              <button @click="rotateRight" class="luxury-btn">
                Rotate Right
              </button>
              <button @click="resetTransform" class="luxury-btn">Reset</button>
              <button @click="closeFullscreen" class="luxury-btn primary">
                Done
              </button>
            </div>
          </div>

          <button class="floating-help" @click="showHelp">Help</button>
        </template>
      </ZoomImg>
    </div>
  </div>
</template>

<script setup lang="ts">
import ZoomImg from "./ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";

function downloadImage() {
  console.log("Download image clicked");
  // Implement download logic
  const link = document.createElement("a");
  link.href = imageSrc;
  link.download = "image.jpg";
  link.click();
}

function shareImage() {
  console.log("Share image clicked");
  // Implement share logic
  if (navigator.share) {
    navigator.share({
      title: "Check out this image",
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  }
}

function showHelp() {
  console.log("Help clicked");
  alert(
    "Keyboard shortcuts:\n• Escape: Close fullscreen\n• +/-: Zoom in/out\n• Arrow keys: Rotate\n• R: Reset",
  );
}
</script>

<style scoped>
.custom-fullscreen-btn {
  @apply absolute right-2 top-2 z-10 flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white shadow-lg transition-colors hover:bg-blue-700;
}

.custom-controls {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4;
}

.zoom-info {
  @apply mb-2 text-center text-sm text-white;
}

.control-buttons {
  @apply flex justify-center gap-2;
}

.control-btn {
  @apply flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50;
}

.control-btn.close-btn {
  @apply bg-red-500/80 hover:bg-red-500;
}

.floating-btn {
  @apply absolute flex items-center justify-center rounded-full px-3 py-2 shadow-lg transition-all hover:scale-110;
}

.top-left {
  top: 1rem;
  left: 1rem;
}
.top-right {
  top: 1rem;
  right: 1rem;
}
.bottom-right {
  bottom: 1rem;
  right: 1rem;
}
.bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.floating-zoom {
  @apply absolute flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg;
}

.mini-btn {
  @apply flex h-6 w-6 items-center justify-center rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50;
}

.zoom-text {
  @apply min-w-[3rem] text-center text-xs font-medium text-gray-700;
}

.luxury-fullscreen-btn {
  @apply absolute right-2 top-2 z-10 flex transform items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white shadow-lg transition-all hover:scale-105 hover:from-purple-700 hover:to-pink-700;
}

.luxury-close-btn {
  @apply absolute right-0 top-0 m-4 flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20;
}

.luxury-controls {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6;
}

.luxury-info {
  @apply mb-4 text-center text-white;
}

.zoom-level {
  @apply text-2xl font-bold;
}

.separator {
  @apply mx-2 opacity-50;
}

.action-text {
  @apply text-sm opacity-75;
}

.luxury-buttons {
  @apply flex flex-wrap justify-center gap-3;
}

.luxury-btn {
  @apply rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20;
}

.luxury-btn.primary {
  @apply border-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600;
}

.floating-help {
  @apply absolute bottom-4 left-4 flex items-center justify-center rounded-full bg-yellow-500 px-3 py-2 text-black shadow-lg transition-colors hover:bg-yellow-600;
}
</style>
