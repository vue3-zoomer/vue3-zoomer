<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div class="h-[30rem] w-[30rem]">
      <DragZoomImg class="h-[30rem] w-[30rem]" :src="red" :zoom-scale="5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import DragZoomImg from "./components/DragZoomImg.vue";
</script>
