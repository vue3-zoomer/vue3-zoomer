<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <ZoomMapWrapper class="h-[30rem] w-[30rem]" :src="red" :zoom-scale="5" />
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import ZoomMapWrapper from "./components/Wrapper/ZoomMapWrapper.vue";
</script>
