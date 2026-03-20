<script setup lang="ts">
import "~/assets/css/main.css";
import ZoomImg from "~/components/ZoomImg.vue";
import imageSrc from "~/assets/images/red.jpg";
</script>

# Fullscreen Mode

## Overview

The fullscreen mode provides an immersive image viewing experience with gesture support and flexible slot-based customization. When enabled, users can view images in a modal overlay with zoom, rotation, and pan capabilities. The component uses Vue slots to give developers complete control over the UI elements.

## Basic Usage

### Enable Fullscreen

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
    fullscreen
  />

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="3"
  fullscreen
/>
```

### Fullscreen with Custom Options

<ZoomImg
    class="h-[30rem]"
    zoom-type="drag"
    :src="imageSrc"
    :zoom-scale="3"
    fullscreen
    :show-fullscreen-toolbar="true"
    :enable-gestures="true"
  />

```vue
<ZoomImg
  class="h-[30rem]"
  zoom-type="drag"
  :src="imageSrc"
  :zoom-scale="3"
  fullscreen
  :show-fullscreen-toolbar="true"
  :enable-gestures="true"
/>
```

## Gesture Support

The fullscreen mode supports comprehensive gesture controls for both desktop and mobile devices:

### Touch Gestures (Mobile)
- **Pinch to Zoom**: Use two fingers to zoom in and out
- **Pan/Drag**: Single finger drag to move the image
- **Double Tap**: Reset to default zoom and position
- **Single Tap**: Can be customized for additional actions

### Mouse Gestures (Desktop)
- **Scroll Wheel**: Zoom in and out
- **Click and Drag**: Pan the image
- **Keyboard Shortcuts**: See keyboard controls below

### Keyboard Shortcuts
- **Escape**: Close fullscreen
- **Plus (+) or Equals (=)**: Zoom in
- **Minus (-) or Underscore (_)**: Zoom out
- **Arrow Left**: Rotate left
- **Arrow Right**: Rotate right
- **R**: Reset transform

## Slots

The fullscreen mode provides flexible slots for complete customization:

### `fullscreen-button` Slot

Customize the button that opens fullscreen mode. Appears in the top-right corner of the image.

```vue
<ZoomImg :src="imageSrc" fullscreen>
  <template #fullscreen-button>
    <button class="custom-fullscreen-btn">
      <img src="/icons/custom-fullscreen.svg" alt="View Fullscreen" />
      View Fullscreen
    </button>
  </template>
</ZoomImg>
```

### `close-button` Slot

Customize the close button in the fullscreen toolbar.

```vue
<ZoomImg :src="imageSrc" fullscreen>
  <template #close-button>
    <button class="custom-close-btn">
      × Exit Fullscreen
    </button>
  </template>
</ZoomImg>
```

### `controls` Slot

Replace the entire bottom toolbar with custom controls. Receives all the action methods as slot props.

```vue
<ZoomImg :src="imageSrc" fullscreen>
  <template #controls="{ zoomIn, zoomOut, rotateLeft, rotateRight, resetTransform, closeFullscreen, currentScale, zoomScale }">
    <div class="custom-controls">
      <button @click="zoomIn" :disabled="currentScale >= zoomScale">
        Zoom In ({{ Math.round(currentScale * 100) }}%)
      </button>
      <button @click="zoomOut" :disabled="currentScale <= 1">
        Zoom Out
      </button>
      <button @click="rotateLeft">↺ Rotate</button>
      <button @click="rotateRight">↻ Rotate</button>
      <button @click="resetTransform">Reset</button>
      <button @click="closeFullscreen">Close</button>
    </div>
  </template>
</ZoomImg>
```

### `floating-buttons` Slot

Add floating action buttons anywhere in the fullscreen view. Perfect for additional actions like download, share, etc.

```vue
<ZoomImg :src="imageSrc" fullscreen>
  <template #floating-buttons="{ currentScale, closeFullscreen }">
    <!-- Download button in top-left -->
    <button class="floating-btn top-left" @click="downloadImage">
      <img src="/icons/download.svg" alt="Download" />
    </button>
    
    <!-- Share button in top-right -->
    <button class="floating-btn top-right" @click="shareImage">
      <img src="/icons/share.svg" alt="Share" />
    </button>
    
    <!-- Info button in bottom-left -->
    <button class="floating-btn bottom-left" @click="showInfo">
      <img src="/icons/info.svg" alt="Info" />
    </button>
  </template>
</ZoomImg>
```

## Slot Props

The `controls` and `floating-buttons` slots receive the following props:

| Prop | Type | Description |
|------|------|-------------|
| `currentScale` | `number` | Current zoom level (1.0 = 100%) |
| `rotation` | `number` | Current rotation in degrees |
| `position` | `{ x: number, y: number }` | Current pan position |
| `zoomIn` | `() => void` | Function to zoom in |
| `zoomOut` | `() => void` | Function to zoom out |
| `rotateLeft` | `() => void` | Function to rotate left |
| `rotateRight` | `() => void` | Function to rotate right |
| `resetTransform` | `() => void` | Function to reset all transforms |
| `closeFullscreen` | `() => void` | Function to close fullscreen |
| `zoomScale` | `number` | Maximum zoom level |

## Default Controls

When no custom `controls` slot is provided, the component shows default controls:

- Zoom In (+)
- Zoom Out (-)
- Rotate Left (↺)
- Rotate Right (↻)
- Reset (⟲)

## Styling Floating Buttons

Use CSS positioning to place floating buttons:

```css
.floating-btn {
  @apply absolute flex items-center justify-center w-12 h-12 bg-white/90 rounded-full shadow-lg transition-all hover:bg-white;
}

.top-left { top: 1rem; left: 1rem; }
.top-right { top: 1rem; right: 1rem; }
.bottom-left { bottom: 1rem; left: 1rem; }
.bottom-right { bottom: 1rem; right: 1rem; }
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fullscreen` | `boolean` | `false` | Enable fullscreen mode |
| `showFullscreenToolbar` | `boolean` | `true` | Show toolbar with controls |
| `enableGestures` | `boolean` | `true` | Enable touch and mouse gestures |

## Events

Fullscreen mode emits the following events through the parent component:

| Name | Description |
|------|-------------|
| `fullscreen-open` | Fired when fullscreen mode opens |
| `fullscreen-close` | Fired when fullscreen mode closes |

## Mobile Optimization

The fullscreen mode is optimized for mobile devices with:

- Touch-friendly button sizes
- Smooth gesture animations
- Responsive layout
- Performance optimizations
- Hardware acceleration

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- ARIA labels and descriptions

## Styling

Fullscreen mode uses Tailwind CSS classes and can be customized through CSS variables:

```css
:root {
  --vz-fullscreen-bg: rgba(0, 0, 0, 0.9);
  --vz-fullscreen-toolbar-bg: rgba(0, 0, 0, 0.5);
  --vz-button-bg: rgba(255, 255, 255, 0.2);
  --vz-button-hover-bg: rgba(255, 255, 255, 0.3);
}
```

## Examples

### E-commerce Product Viewer

```vue
<ZoomImg :src="productImage" fullscreen>
  <template #fullscreen-button>
    <button class="product-fullscreen-btn">
      <img src="/icons/expand.svg" alt="View in Fullscreen" />
    </button>
  </template>
  
  <template #controls="{ zoomIn, zoomOut, resetTransform }">
    <div class="product-controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
      <button @click="resetTransform">Reset</button>
    </div>
  </template>
  
  <template #floating-buttons="{ currentScale }">
    <button class="favorite-btn" @click="toggleFavorite">
      <img src="/icons/heart.svg" alt="Add to Favorites" />
    </button>
    <button class="compare-btn" @click="addToCompare">
      <img src="/icons/compare.svg" alt="Compare" />
    </button>
  </template>
</ZoomImg>
```

### Art Gallery Viewer

```vue
<ZoomImg :src="artwork.image" fullscreen>
  <template #controls="{ zoomIn, zoomOut, rotateLeft, rotateRight, currentScale }">
    <div class="gallery-controls">
      <div class="zoom-controls">
        <button @click="zoomIn" :disabled="currentScale >= 3">Zoom In</button>
        <span>{{ Math.round(currentScale * 100) }}%</span>
        <button @click="zoomOut" :disabled="currentScale <= 1">Zoom Out</button>
      </div>
      <div class="rotation-controls">
        <button @click="rotateLeft">↺</button>
        <button @click="rotateRight">↻</button>
      </div>
    </div>
  </template>
  
  <template #floating-buttons>
    <button class="artwork-info" @click="showArtworkDetails">
      <img src="/icons/info.svg" alt="Artwork Info" />
    </button>
    <button class="artwork-share" @click="shareArtwork">
      <img src="/icons/share.svg" alt="Share Artwork" />
    </button>
  </template>
</ZoomImg>
```

### Minimalist Viewer

```vue
<ZoomImg :src="imageSrc" fullscreen :show-fullscreen-toolbar="false">
  <!-- No toolbar, just gestures and escape key -->
</ZoomImg>
```

### Custom Styled Viewer

```vue
<ZoomImg :src="imageSrc" fullscreen>
  <template #fullscreen-button>
    <div class="custom-fullscreen-trigger">
      <svg>...</svg>
      <span>Expand</span>
    </div>
  </template>
  
  <template #close-button>
    <div class="custom-close">
      ✕
    </div>
  </template>
  
  <template #controls="{ zoomIn, zoomOut, resetTransform, closeFullscreen }">
    <div class="my-custom-toolbar">
      <button @click="zoomIn" class="zoom-btn">+</button>
      <button @click="zoomOut" class="zoom-btn">−</button>
      <button @click="resetTransform" class="reset-btn">⟲</button>
      <button @click="closeFullscreen" class="close-btn">Done</button>
    </div>
  </template>
</ZoomImg>
