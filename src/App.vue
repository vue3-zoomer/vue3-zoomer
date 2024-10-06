<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <ZoomMapWrapper class="h-[32rem] w-[32rem]" :src="red" />
  </div>
</template>

<script setup lang="ts">
import "./assets/css/main.css";
import red from "./assets/images/red.jpg";
import ZoomMapWrapper from "./components/Wrapper/ZoomMapWrapper.vue";
</script>
