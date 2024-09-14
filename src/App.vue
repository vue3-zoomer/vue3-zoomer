<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <div class="h-1/2 w-1/2">
      <ZoomImg :src="red" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ZoomImg from "./components/ZoomImg.vue";
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
</script>
