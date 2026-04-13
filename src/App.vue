<template>
  <div class="centered-container">
    <ZoomImg
      class="h-[30rem]"
      trigger="hover"
      zoom-type="drag"
      :src="red"
      :zoom-scale="3"
      :step="1"
      :fullScreenMode="true"
      :show-zoom-btns="true"
      :rotate="rotation"
      @close-full-screen="rotation = 0"
    >
      <template #controls="{ zoomIn, zoomOut }">
        <div class="flex gap-2 p-2">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl shadow hover:bg-white"
            @click="zoomIn"
          >
            <img src="./assets/icons/plus.svg" alt="plus icon" />
          </button>
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl shadow hover:bg-white"
            @click="zoomOut"
          >
            <img src="./assets/icons/minus.svg" alt="minus icon" />
          </button>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-xl shadow hover:bg-white"
            @click="handleRotate"
          >
            <img src="./assets/icons/rotate.svg" alt="rotate icon" />
          </button>
        </div>
      </template>
    </ZoomImg>
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import ZoomImg from "./components/ZoomImg.vue";
import { ref } from "vue";

const rotation = ref(0);

const handleRotate = () => {
  rotation.value = (rotation.value + 90) % 360;
};
</script>

<style>
.centered-container {
  display: flex;
  /* height: 100vh; */
  /* width: 100vw; */
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  gap: 2rem;
}

.vz-full-screen-backdrop .vz-zoomimg-img-container {
  width: 750px;
  height: unset;
}
</style>
