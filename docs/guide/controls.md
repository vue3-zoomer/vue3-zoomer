<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

# Zoom Controls Component

## Overview

The Zoom Map component enables users to zoom into an image within a defined viewport, combining interactive movement and zoom controls. Users can select between cursor-following movement for quick focus or a drag-based approach for precise navigation within the zoomed area. This component supports both click and hover triggers, allowing for versatile interaction, and offers customizable zoom levels. Paired with the Zoom Buttons component, which provides plus and minus zoom controls, the setup offers an intuitive interface with the flexibility to limit zoom ranges.

## Basic Usage

### Zoom Map

<br />
<ClientOnly>
    <ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="5"
    :show-img-map=true
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
    :zoom-scale="3"
    :show-img-map=true
  />
```

### Zoom buttons

<br />
<ClientOnly>
  <ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
   :show-zoom-btns=true
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
    :zoom-scale="3"
    :show-zoom-btns=true
  />
```



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