<script setup lang="ts">
import ZoomImg from "~/components/ZoomImg.vue";
import red from "~/assets/images/red.jpg";
import "~/assets/css/main.css";
</script>

# Zoom Image Component

## Overview

The zoom img component allows users to zoom into an image and either move or drag it for a closer inspection. This functionality is useful for scenarios where users need to view detailed portions of an image, such as product images or maps, by providing an interactive zoom experience. Depending on the chosen zoom type (move or drag), users can either pan across the image or drag it while zoomed in, making it easier to explore specific areas.

## Basic Usage

### Drag
<br />
<ZoomImg
      class="h-[30rem]"
      :src="red"
      :zoom-scale="5"
      zoom-type="drag"
      :step="1"
      :show-zoom-btns="false"
    />

```vue
<ZoomImg
  class="h-[30rem]"
  :src="red"
  :zoom-scale="5"
  zoom-type="drag"
  :step="1"
  :show-zoom-btns="false"
/> 
```
### Move
<br />
<ZoomImg
      class="h-[30rem]"
      :src="red"
      :zoom-scale="5"
      zoom-type="move"
      :step="1"
      :show-zoom-btns="false"
    />

```vue
<ZoomImg
  class="h-[30rem]"
  :src="red"
  :zoom-scale="5"
  zoom-type="move"
  :step="1"
  :show-zoom-btns="false"
/> 
```


::: tip Note 
You can explore zoom controls such as buttons for managing zoom levels and a zoom map for navigating the image. To see these features in action, visit this link.
[Zoom Controllers](/guide/controls.html){target="_self"}
:::

## Props and Events

### Props

| Name         | Type                 | Default    | Description                                                                |
| ------------ | -------------------- | ---------- | -------------------------------------------------------------------------- |
| `src`        | `String`             | `required` | The source URL of the image to be zoomed.                                  |
| `zoomScale`  | `Number`             | `2`        | The initial zoom scale of the image.                                       |
| `trigger`    | `"click" \| "hover"` | `"click"`  | The event that triggers the zoom functionality, either "click" or "hover". |
| `zoomType`   | `"move" \| "drag"`   | `"move"`   | The type of zoom interaction, either "move" or "drag".                     |
| `step`       | `Number`             | -          | The step value for the zoom scale.   
| `showZoomBtns`       | `Boolean`             | -          | The controls to increase or decrease the zoom scale from buttons.                                         |
| `persist`    | `Boolean`            | -          | Whether the zoom state should persist across component mounts.             |
| `showImgMap` | `Boolean`            | -          | Whether to display the image map overlay.     

### Events

| Name                   | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `onLoad`                  | Triggered when the image has successfully loaded.                     |
| `onError`            | Triggered when there is an error loading the image.  