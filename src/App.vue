<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Magnifier class="h-[44rem]" :src="red" />
  </div>
</template>

<script setup lang="ts">
import "./assets/css/main.css";
import red from "./assets/images/red.jpg";
import Magnifier from "./components/Magnifier.vue";
</script>
