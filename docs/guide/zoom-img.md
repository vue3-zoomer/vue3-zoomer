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

## Trigger

The `trigger` prop controls how zooming is activated. Use `"click"` to toggle zoom on click (the default), or `"hover"` to zoom while the cursor is over the image.

<ZoomImg
    class="h-[30rem]"
    zoom-type="move"
    trigger="hover"
    :src="imageSrc"
    :zoom-scale="3"
/>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="move"
  trigger="hover"
  :src="imageSrc"
  :zoom-scale="3"
/>
```

## Persist

By default, hovering away from the image resets the zoom. Enable `persist` to keep the current zoom state when the cursor leaves the image.

<ZoomImg
    class="h-[30rem]"
    zoom-type="move"
    trigger="hover"
    :src="imageSrc"
    :zoom-scale="3"
    persist
/>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="move"
  trigger="hover"
  :src="imageSrc"
  :zoom-scale="3"
  persist
/>
```

## Fullscreen Mode

The fullscreen mode provides an immersive image viewing experience with slot-based customization. When enabled, a fullscreen trigger can be rendered over the image and the zoom component is teleported into a full-screen backdrop.

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
    full-screen-mode
  />

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="3"
  full-screen-mode
/>
```

::: tip Note
For detailed fullscreen documentation including custom buttons, controls, and examples, see [Fullscreen Mode](/guide/controls.html#fullscreen-mode).
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

| Name                     | Type                 | Default        | Description                                                                |
| ------------------------ | -------------------- | -------------- | -------------------------------------------------------------------------- |
| `src`                    | `String`             | `required`     | The source URL of the image to be zoomed.                                  |
| `alt`                    | `String`             | `"zoomed-img"` | Alternative text description of the image for accessibility.               |
| `zoomScale`              | `Number`             | `2`            | The desired zoom scale of the image.                                       |
| `trigger`                | `"click" \| "hover"` | `"click"`      | The event that triggers the zoom functionality, either "click" or "hover". |
| `zoomType`               | `"move" \| "drag"`   | `"move"`       | The type of zoom interaction, either "move" or "drag".                     |
| `step`                   | `Number`             | -              | The step value for the zoom scale.                                         |
| `persist`                | `Boolean`            | `false`        | Whether the zoom state should persist on mouse leave.                      |
| `rotate`                 | `Number`             | `0`            | Rotation angle applied to the image, in degrees. Best used in fullscreen mode or when the component is taken out of the normal document flow (e.g. `position: absolute` or `fixed`), since rotation does not adjust the layout box. |
| `showZoomBtns`           | `Boolean`            | `false`        | Show controls to increase or decrease the zoom scale from buttons.         |
| `showImgMap`             | `Boolean`            | `false`        | Whether to display the image map overlay.                                  |
| `showImgMapInFullScreen` | `Boolean`            | `false`        | Render the image map inside the fullscreen viewer as well.                 |
| `imgMapRatio`            | `Number`             | `0.25`         | Size ratio of the image map relative to the source image.                  |
| `fullScreenMode`         | `Boolean`            | `false`        | Enable the fullscreen viewer for the image.                                |
| `closeOnClickOutside`    | `Boolean`            | `false`        | Close fullscreen when clicking on the backdrop outside the image.          |

### Events

| Name              | Description                                         |
| ----------------- | --------------------------------------------------- |
| `load`            | Triggered when the image has successfully loaded.   |
| `error`           | Triggered when there is an error loading the image. |
| `closeFullScreen` | Triggered when the fullscreen viewer is closed.     |
