<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

# Zoom Image Component

## Overview

The ZoomImg component allows users to zoom into an image within its original container. You can choose between two interaction modes: move-based zooming where the image follows the cursor position, or drag-based zooming where users can freely drag the zoomed area. The component supports click and hover triggers, customizable zoom scales, and more.

## Basic Usage

### Move

<ClientOnly>
  <ZoomImg
    class="h-[30rem]"
    zoom-type="move"
    trigger="click"
    :src="imageSrc"
    :zoom-scale="3"
  />
  <template #fallback>
    <div class="h-[30rem] w-full animate-pulse bg-gray-500"/> 
  </template>
</ClientOnly>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="move"
  trigger="click"
  :src="imageSrc"
  :zoom-scale="3"
/>
```

### Drag

<ClientOnly>
  <ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
  />
  <template #fallback>
    <div class="h-[30rem] w-full animate-pulse bg-gray-500" /> 
  </template>
</ClientOnly>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  trigger="click"
  :src="imageSrc"
  :zoom-scale="3"
/>
```

::: tip Note
You can explore zoom controls such as buttons for managing zoom levels and a zoom map for navigating the image. To see these features in action, visit this link.
[Zoom Controllers](/guide/controls.html)
:::

## Props and Events

### Props

| Name           | Type                 | Default    | Description                                                                |
| -------------- | -------------------- | ---------- | -------------------------------------------------------------------------- |
| `src`          | `String`             | `required` | The source URL of the image to be zoomed.                                  |
| `zoomScale`    | `Number`             | `2`        | The desired zoom scale of the image.                                       |
| `trigger`      | `"click" \| "hover"` | `"click"`  | The event that triggers the zoom functionality, either "click" or "hover". |
| `zoomType`     | `"move" \| "drag"`   | `"move"`   | The type of zoom interaction, either "move" or "drag".                     |
| `step`         | `Number`             | -          | The step value for the zoom scale.                                         |
| `showZoomBtns` | `Boolean`            | false      | Show controls to increase or decrease the zoom scale from buttons.         |
| `persist`      | `Boolean`            | false      | Whether the zoom state should persist on mouse leave.                      |
| `showImgMap`   | `Boolean`            | false      | Whether to display the image map overlay.                                  |

### Events

| Name      | Description                                         |
| --------- | --------------------------------------------------- |
| `onLoad`  | Triggered when the image has successfully loaded.   |
| `onError` | Triggered when there is an error loading the image. |
