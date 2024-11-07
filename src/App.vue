<template>
  <div class="flex h-screen w-screen items-center justify-center p-5">
    <ZoomImg
      class="h-[30rem]"
      :src="red"
      :zoom-scale="5"
      zoom-type="drag"
      :step="1"
      :show-add-sub-btn="true"
    />
  </div>
</template>

<script setup lang="ts">
import red from "./assets/images/red.jpg";
import "./assets/css/main.css";
import ZoomImg from "./components/ZoomImg.vue";
</script>
