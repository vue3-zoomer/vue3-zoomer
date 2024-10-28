---
outline: deep
---

# Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'
import App from "./src/app.vue";
const { theme, page, frontmatter } = useData()

</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'
import red from "~/assets/images/red.jpg";
import MoveZoomImg from '~/components/MoveZoomImg.vue';
const { site, theme, page, frontmatter } = useData()
import "~/assets/css/main.css";
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).

# Component

<MoveZoomImg class="h-[30rem] w-[30rem]" :src="red" :zoom-scale="5" />
