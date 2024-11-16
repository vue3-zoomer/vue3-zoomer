# Installation

install the package using the package manger of your choice

::: code-group

```bash [npm]
npm install vue3-zoomer
```

```bash [yarn]
yarn add vue3-zoomer
```

```bash [bun]
bun install vue3-zoomer
```

:::

## Basic Usage

First, import the `ZoomImg` component:

```ts
import ZoomImg from "vue3-zoomer";
```

Then, use the `ZoomImg` component in your template:

```vue
<ZoomImg :src="imageSrc" />
```

### Demo

<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

<ClientOnly>
  <ZoomImg :src="imageSrc" />
  <template #fallback>
    <div class="h-[30rem] w-full animate-pulse bg-gray-500"/>
  </template>
</ClientOnly>
