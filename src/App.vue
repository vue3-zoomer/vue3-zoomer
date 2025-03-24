<template>
  <div class="centered-container">
    <ZoomImg
      class="h-[30rem]"
      :src="red"
      :zoom-scale="5"
      zoom-type="drag"
      :step="1"
      :show-zoom-btns="false"
    />
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import ZoomImg from "./components/ZoomImg.vue";
</script>

<style scoped>
.centered-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}
</style>
