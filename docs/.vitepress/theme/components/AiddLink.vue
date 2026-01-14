<template>
  <a :href="adUrl" target="_blank" rel="noopener" class="link">
    <img :src="adImage" :alt="adTitle" />
  </a>
</template>

<script setup>
const adUrl = "https://www.aidd.io?friend=VUEZOOMER";
const adImage =
  "https://assets.partnero.com/program/7S0C27IB/resources/a7cd79f51/asset_image.png?c=6880f45d15a90";
const adTitle = "AIDD";
</script>

<style scoped>
.link {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.link img {
  width: 120px;
}
</style>
