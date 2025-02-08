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

<ZoomImg
    class="h-[30rem]"
    zoom-type="move"
    trigger="click"
    :src="imageSrc"
    :zoom-scale="3"
  />

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

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
/>

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

## Multi Step Zoom

The Multi-Step Zoom feature allows users to zoom in and out with multiple clicks. You can set the `step` prop to control how much the zoom level changes each time. Starting at a scale of 1x, each click increases the zoom until the maximum level `zoomScale`. Clicking again at maximum zoom decreases the level in the same increments, smoothly cycling between the default and maximum zoom.

  <ZoomImg class="h-[30rem]" :src="imageSrc" :zoom-scale="5" :step="1" />

```vue
<ZoomImg class="h-[30rem]" :src="imageSrc" :zoom-scale="5" :step="1" />
```

::: tip Note
Multi zoom is disabled by default. To enable it, provide a value to the `step` prop which accepts any number, including fractions.
:::

## Slots

### `loading`

Use the `loading` slot to set the content of the zoom image when the image is loading

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  trigger="click"
  :src="imageSrc"
  :zoom-scale="3"
>
  <template #loading>
    <!-- Write your content here -->    
  </template>
</ZoomImg>
```

### `error`

Use the `error` slot to set the content of the zoom image when there is an error loading the image

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  trigger="click"
  :src="imageSrc"
  :zoom-scale="3"
>
  <template #error>
    <!-- Write your content here -->    
  </template>
</ZoomImg>
```

## Props and Events

### Props

| Name           | Type                 | Default        | Description                                                                |
| -------------- | -------------------- | -------------- | -------------------------------------------------------------------------- |
| `src`          | `String`             | `required`     | The source URL of the image to be zoomed.                                  |
| `alt`          | `String`             | `"zoomed-img"` | Alternative text description of the image for accessibility.               |
| `zoomScale`    | `Number`             | `2`            | The desired zoom scale of the image.                                       |
| `trigger`      | `"click" \| "hover"` | `"click"`      | The event that triggers the zoom functionality, either "click" or "hover". |
| `zoomType`     | `"move" \| "drag"`   | `"move"`       | The type of zoom interaction, either "move" or "drag".                     |
| `step`         | `Number`             | -              | The step value for the zoom scale.                                         |
| `persist`      | `Boolean`            | false          | Whether the zoom state should persist on mouse leave.                      |
| `showZoomBtns` | `Boolean`            | false          | Show controls to increase or decrease the zoom scale from buttons.         |
| `showImgMap`   | `Boolean`            | false          | Whether to display the image map overlay.                                  |

### Events

| Name    | Description                                         |
| ------- | --------------------------------------------------- |
| `load`  | Triggered when the image has successfully loaded.   |
| `error` | Triggered when there is an error loading the image. |
