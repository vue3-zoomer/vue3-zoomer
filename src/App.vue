<template>
  <div class="centered-container">
    <!-- <ZoomImg
      class="h-[30rem]"
      :src="red"
      :zoom-scale="5"
      zoom-type="move"
      :step="1"
      trigger="hover"
      :show-zoom-btns="true"
      fullscreen
    />

    <Magnifier class="h-[30rem]" :src="red" :zoom-scale="5" :size="200" /> -->

    <FullscreenSlotExample />
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import ZoomImg from "./components/ZoomImg.vue";
import Magnifier from "./components/Magnifier.vue";
import FullscreenSlotExample from "./components/FullscreenSlotExample.vue";
</script>

<style scoped>
.centered-container {
  display: flex;
  /* height: 100vh; */
  /* width: 100vw; */
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  gap: 2rem;
}
</style>
