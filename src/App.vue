<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <ZoomMapWrapper class="h-1/2 w-1/2" :src="red" />
  </div>
</template>

<script setup lang="ts">
import "./assets/css/main.css";
import red from "./assets/images/red.jpg";
import ZoomMapWrapper from "./components/Wrapper/ZoomMapWrapper.vue";
</script>
