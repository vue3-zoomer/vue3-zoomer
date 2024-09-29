<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <ZoomMap :src="red" trigger="click" :zoom-scale="5" />
  </div>
</template>

<script setup lang="ts">
import "./assets/css/main.css";
import red from "./assets/images/red.jpg";
import MoveZoomImg from "./components/MoveZoomImg.vue";
import ZoomImg from "./components/ZoomImg.vue";
import ZoomMap from "./components/ZoomMap.vue";
</script>
