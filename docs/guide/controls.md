<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

<style>
.vz-full-screen-backdrop .vz-zoomimg-img-container {
  width: 750px;
  height: unset;
}
</style>

# Zoom Controls Component

## Overview

Our components provide two control types: external, which are wrapper components, and internal, which are built-in components accessed via props. Internal controls include interactive zoom buttons, an image map for navigation, and rotation.

::: tip Note
Currently, we only provide internal controls for the `ZoomImg` component like the zoom map, zoom buttons, and rotation. Additional controls will be added in future releases.
:::

## Zoom Map

The image map provides an interactive miniature navigation overview of the zoomed content on user interaction. Users can click or drag on the map to navigate to different portions of the zoomed image, making it easier to explore and navigate large images.

<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :show-img-map="true"
/>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :show-img-map="true"
/>
```

### Map Size

Use `imgMapRatio` to control how large the image map renders relative to the source image. Defaults to `0.25`.

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  :show-img-map="true"
  :img-map-ratio="0.4"
/>
```

### Map in Fullscreen

Enable `showImgMapInFullScreen` to keep the image map available while the viewer is in fullscreen mode.

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="5"
  full-screen-mode
  :show-img-map="true"
  :show-img-map-in-full-screen="true"
/>
```

## Zoom buttons

The zoom buttons provide a familiar interface for zooming in and out of the component. When enabled, plus (+) and minus (-) buttons appear on the component.

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="5"
    :step="1"
    :show-zoom-btns="true"
  />

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

## Fullscreen Mode

Fullscreen mode provides an immersive image viewing experience with flexible slot-based customization. When enabled, the zoom component is teleported into a full-screen backdrop so users can view and interact with the image in a modal overlay. Slots give you control over the fullscreen trigger, the close button, and the bottom controls bar.

### Enable Fullscreen

<ZoomImg
    class="h-[30rem] w-full"
    zoom-type="drag"
    full-screen-mode
    :src="imageSrc"
    :zoom-scale="3"
/>

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  full-screen-mode
  :src="imageSrc"
  :zoom-scale="3"
/>
```

### Close on Click Outside

Enable `close-on-click-outside` so that clicking the backdrop around the image dismisses the viewer.

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
    full-screen-mode
    close-on-click-outside
  />

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="3"
  full-screen-mode
  close-on-click-outside
/>
```

### Slots

Fullscreen mode exposes slots for the parts of the viewer you are most likely to customize.

#### `full-screen-button` Slot

Replace the default trigger that sits over the image when `full-screen-mode` is enabled. The slot receives the current open state as `openFullScreen`.

```vue
<ZoomImg :src="imageSrc" full-screen-mode>
  <template #full-screen-button="{ openFullScreen }">
    <button class="custom-fullscreen-btn" :aria-pressed="openFullScreen">
      <img src="/icons/custom-fullscreen.svg" alt="View Fullscreen" />
      View Fullscreen
    </button>
  </template>
</ZoomImg>
```

::: warning
The slot does not currently expose a function to open fullscreen. Overriding this slot replaces the default button — including its click handler — so the custom content is primarily for styling. If you need a fully custom trigger, style the default `.open-button` element through CSS instead.
:::

#### `close-button` Slot

Customize the close button shown in the top-right corner of the fullscreen backdrop. The slot receives a `close` function that closes the viewer. If you do not provide the slot, a default close button is rendered automatically.

```vue
<ZoomImg :src="imageSrc" full-screen-mode>
  <template #close-button="{ close }">
    <button class="custom-close-btn" @click="close">
      × Exit Fullscreen
    </button>
  </template>
</ZoomImg>
```

#### `controls` Slot

Replace the entire bottom toolbar with custom controls. The slot receives the current zoom scale and the zoom action methods.

```vue
<ZoomImg :src="imageSrc" full-screen-mode>
  <template #controls="{ currentScale, zoomIn, zoomOut }">
    <div class="custom-controls">
      <button @click="zoomIn">
        Zoom In ({{ Math.round(currentScale * 100) }}%)
      </button>
      <button @click="zoomOut">Zoom Out</button>
    </div>
  </template>
</ZoomImg>
```

### Slot Props

The slots provided by fullscreen mode expose the following props:

| Slot                 | Prop             | Type         | Description                         |
| -------------------- | ---------------- | ------------ | ----------------------------------- |
| `full-screen-button` | `openFullScreen` | `boolean`    | Current open state of the viewer.   |
| `close-button`       | `close`          | `() => void` | Closes the fullscreen viewer.       |
| `controls`           | `currentScale`   | `number`     | Current zoom level (`1` = default). |
| `controls`           | `zoomIn`         | `() => void` | Increases the zoom by one `step`.   |
| `controls`           | `zoomOut`        | `() => void` | Decreases the zoom by one `step`.   |

### Fullscreen Props

| Name                     | Type      | Default | Description                                                       |
| ------------------------ | --------- | ------- | ----------------------------------------------------------------- |
| `fullScreenMode`         | `Boolean` | `false` | Enable fullscreen mode.                                           |
| `closeOnClickOutside`    | `Boolean` | `false` | Close fullscreen when clicking on the backdrop outside the image. |
| `showImgMapInFullScreen` | `Boolean` | `false` | Render the image map inside the fullscreen viewer as well.        |

### Fullscreen Events

| Name              | Description                                     |
| ----------------- | ----------------------------------------------- |
| `closeFullScreen` | Triggered when the fullscreen viewer is closed. |

### Examples

#### Sizing the Fullscreen Image

By default, the fullscreen viewer fills the available space. Override the image container size by targeting `.vz-zoomimg-img-container` inside `.vz-full-screen-backdrop`.

```css
.vz-full-screen-backdrop .vz-zoomimg-img-container {
  width: 750px;
  height: unset;
}
```

#### Minimalist Viewer

Use `close-on-click-outside` with no custom controls slot for a barebones fullscreen experience.

```vue
<ZoomImg :src="imageSrc" full-screen-mode close-on-click-outside />
```

#### Custom Close Button

```vue
<ZoomImg :src="imageSrc" full-screen-mode>
  <template #close-button="{ close }">
    <div class="custom-close" @click="close">
      ✕
    </div>
  </template>
</ZoomImg>
```

## Rotation

The `rotate` prop applies a rotation (in degrees) to the image. The rotation is preserved while zooming and panning, so it pairs naturally with the rest of the controls.

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="3"
  full-screen-mode
  :rotate="90"
/>
```

::: tip Note
`rotate` is best used in fullscreen mode, or when the component is taken out of the normal document flow (e.g. `position: absolute` or `fixed`). A rotated image keeps its original layout box, so rotating an in-flow component can cause it to overlap surrounding content.
:::

### Wiring Rotation Into the Fullscreen Controls Slot

Because `rotate` is a regular prop, you can drive it from your application state and expose rotation buttons through the fullscreen `controls` slot.

```vue
<script setup lang="ts">
import { ref } from "vue";
const rotation = ref(0);
const rotateLeft = () => (rotation.value -= 90);
const rotateRight = () => (rotation.value += 90);
</script>

<template>
  <ZoomImg :src="imageSrc" :rotate="rotation" full-screen-mode>
    <template #controls="{ zoomIn, zoomOut }">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
      <button @click="rotateLeft">↺</button>
      <button @click="rotateRight">↻</button>
    </template>
  </ZoomImg>
</template>
```
