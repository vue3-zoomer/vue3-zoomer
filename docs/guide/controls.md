<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

# Zoom Controls Component

## Overview

Our components provide two control types: external, which are wrapper components, and internal, which are built-in components accessed via props. Internal controls include interactive zoom buttons and an image map for improved navigation.

::: tip Note
Currently, we only provide internal controls for the `ZoomImg` component like zoom map and zoom buttons . Additional controls will be added in future releases.
:::

## Zoom Map

The image map provides an interactive miniature navigation overview of the zoomed content on user interaction. Users can click or drag on the map to navigate to different portions of the zoomed image, making it easier to explore and navigate large images.

<ClientOnly>
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :show-img-map="true"
/>
<template #fallback>

  <div class="h-[30rem] w-full animate-pulse bg-gray-500"/>
  </template>
</ClientOnly>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :show-img-map="true"
/>
```

## Zoom buttons

The zoom buttons provide a familiar interface for zooming in and out of the component. When enabled, plus (+) and minus (-) buttons appear on the component.

<ClientOnly>
  <ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="5"
    :step="1"
    :show-zoom-btns="true"
  />
  <template #fallback>
    <div class="h-[30rem] w-full animate-pulse bg-gray-500" /> 
  </template>
</ClientOnly>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :step="1"
  :show-zoom-btns="true"
/>
```
