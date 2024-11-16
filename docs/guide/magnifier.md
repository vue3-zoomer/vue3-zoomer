<script setup lang="ts">
import "~/assets/css/main.css";
import Magnifier from "~/components/Magnifier.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

# Magnifier Component

## Overview

The Magnifier component allows users to view an enlarged portion of an image in a container like a glass magnifier when they hover over the image.

## Basic Usage

<Magnifier :src="imageSrc" :zoom-scale="3" :size="250" />

```vue
<Magnifier :src="imageSrc" :zoom-scale="3" :size="250" />
```

::: tip Note
You can also increase or decrease the magnifier size using the mouse wheel.
:::

## Props and Events

### Props

| Name        | Type     | Default    | Description                               |
| ----------- | -------- | ---------- | ----------------------------------------- |
| `src`       | `String` | `required` | The source URL of the image to be zoomed. |
| `zoomScale` | `Number` | `2`        | The desired zoom scale of the image.      |
| `size`      | `Number` | `200`      | The initial magnifier size in pixels.     |

### Events

| Name      | Description                                         |
| --------- | --------------------------------------------------- |
| `onLoad`  | Triggered when the image has successfully loaded.   |
| `onError` | Triggered when there is an error loading the image. |
