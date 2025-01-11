# Custom Styles

The library provides an extensive set of CSS classes for customizing all component elements. These classes are prefixed with `vz-` (ViewerZoom) for easy identification and to avoid conflicts with other styles in your application.

::: warning Note
Some CSS properties like `overflow`, `transform`, and `translate` may interfere with the core functionality of components. Exercise caution when modifying these properties as they could break zoom, pan, or magnification features.
:::

## Components

### Zoom Image

The Zoom Image component follows a nested container pattern to maintain proper scaling and positioning:

```html
<div class="vz-zoomimg-container">
  <div class="vz-zoomimg-img-container">
    <img class="vz-zoomimg-img" />
  </div>
</div>
```

#### Classes Reference

| Class Name                 | Purpose              |
| -------------------------- | -------------------- |
| `vz-zoomimg-container`     | Outermost container  |
| `vz-zoomimg-img-container` | Direct image wrapper |
| `vz-zoomimg-img`           | Image element        |

### Magnifier

The Magnifier uses a layered approach with the lens overlay positioned above the base image:

#### Structure

```html
<div class="vz-magnifier-img-container">
  <img class="vz-magnifier-img" />
  <div class="vz-magnifier-lens">
    <img class="vz-magnifier-lens-img" />
  </div>
</div>
```

#### Classes Reference

| Class Name                   | Purpose         |
| ---------------------------- | --------------- |
| `vz-magnifier-img-container` | Main container  |
| `vz-magnifier-img`           | Base image      |
| `vz-magnifier-lens`          | Magnifying lens |
| `vz-magnifier-lens-img`      | Magnified image |

## Controls

### Zoom Buttons

The buttons are grouped in a container for consistent positioning and spacing. The icons inside buttons are background images in case you want to change them users
background image css property:

```html
<div class="vz-zoom-btns-container">
  <button class="vz-controls-btn vz-zoom-out-btn" />
  <button class="vz-controls-btn vz-zoom-in-btn" />
</div>
```

#### Classes Reference

| Class Name               | Purpose              |
| ------------------------ | -------------------- |
| `vz-zoom-btns-container` | Button group wrapper |
| `vz-controls-btn`        | Base button styles   |
| `vz-zoom-out-btn`        | Zoom out button      |
| `vz-zoom-in-btn`         | Zoom in button       |

### Zoom Map

The map uses a container with a miniature image and an overlay window indicator:

```html
<div class="vz-map-container">
  <img class="vz-map-img" />
  <div class="vz-map-window" />
</div>
```

#### Classes Reference

| Class Name         | Purpose            |
| ------------------ | ------------------ |
| `vz-map-container` | Map wrapper        |
| `vz-map-img`       | Miniature image    |
| `vz-map-window`    | Viewport indicator |
