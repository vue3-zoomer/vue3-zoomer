<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div class="w-3/4">
      <ZoomImg :src="red" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ZoomImg from "./components/ZoomImg.vue";
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
</script>
