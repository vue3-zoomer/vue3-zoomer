<script setup>
import DefaultTheme from "vitepress/theme";
import AiddLink from "./components/AiddLink.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #aside-outline-after>
      <AiddLink />
    </template>
  </Layout>
</template>
