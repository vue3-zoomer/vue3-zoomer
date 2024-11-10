<script setup lang="ts">
import Magnifier from "~/components/Magnifier.vue";
import red from "~/assets/images/red.jpg";
import "~/assets/css/main.css";
</script>


# Magnifier Component

## Overview

The Magnifier allows users to view an enlarged portion of an image when they hover over the image. This is useful for users who might want to see details of a product or for any application where inspecting image details is helpful.

## Basic Usage

<Magnifier :src="red" :zoom-scale="5" :magnifierInitialSize="200" />

```vue
<Magnifier :src="red" :zoom-scale="5" :magnifierInitialSize="200" />
```

::: tip Note 
You can also increase or decrease the magnifier size using the mouse wheel.
:::

## Props and Events

### Props

| Name         | Type                 | Default    | Description                                                                |
| ------------ | -------------------- | ---------- | -------------------------------------------------------------------------- |
| `src`        | `String`             | `required` | The source URL of the image to be zoomed.                                  |
| `zoomScale`  | `Number`             | `2`        | The initial zoom scale of the image.                                       |   |
| `magnifierInitialSize`       | `Number`             | `200`          | The initial magnifier size.                                         |

### Events

| Name                   | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `onLoad`                  | Triggered when the image has successfully loaded.                     |
| `onError`            | Triggered when there is an error loading the image.                          |
