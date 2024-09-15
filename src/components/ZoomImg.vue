<template>
  <figure
    class="iiz"
    ref="imgRef"
    :class="{
      'iiz--drag': currentMoveType === 'drag',
    }"
    :style="{
      width: `${width}px`,
    }"
    v-on="{
      touchstart: isZoomed ? () => {} : handleTouchStart,
      click: handleClick,
      mouseenter: isTouch ? () => {} : handleMouseEnter,
      mousemove:
        currentMoveType === 'drag' || !isZoomed ? () => {} : handleMouseMove,
      mouseleave: isTouch ? () => {} : handleMouseLeave,
    }"
  >
    <div
      :style="{
        paddingTop: createSpacer ? `${(height / width) * 100}%` : '',
      }"
    >
      <template v-if="validSources">
        <picture>
          <source
            v-for="(source, i) in validSources"
            :key="i"
            :srcSet="source.srcSet"
            :sizes="source.sizes"
            :media="source.media"
            :type="source.type"
          />
          <img
            class="iiz__img"
            :class="{
              'iiz__img--hidden': isZoomed,
              'iiz__img--abs': createSpacer,
            }"
            :style="{
              transition: `linear 0ms opacity ${
                isZoomed ? fadeDuration : 0
              }ms, linear 0ms visibility ${isZoomed ? fadeDuration : 0}ms`,
            }"
            :src="src"
            :srcSet="srcSet"
            :sizes="sizes"
            :alt="alt"
          />
        </picture>
      </template>

      <template v-else>
        <img
          class="iiz__img"
          :class="{
            'iiz__img--hidden': isZoomed,
            'iiz__img--abs': createSpacer,
          }"
          :style="{
            transition: `linear 0ms opacity ${
              isZoomed ? fadeDuration : 0
            }ms, linear 0ms visibility ${isZoomed ? fadeDuration : 0}ms`,
          }"
          :src="src"
          :srcSet="srcSet"
          :sizes="sizes"
          :alt="alt"
        />
      </template>
    </div>

    <template v-if="isActive">
      <template v-if="isFullscreen">
        <teleport to="body">
          <div class="iiz__zoom-portal">
            <img
              class="iiz__zoom-img"
              alt=""
              :draggable="false"
              :class="{ 'iiz__zoom-img--visible': isZoomed }"
              :style="{
                top: `${top}px`,
                left: `${left}px`,
                transition: `linear ${
                  isFullscreen ? 0 : fadeDuration
                }ms opacity, linear ${
                  isFullscreen ? 0 : fadeDuration
                }ms visibility`,
              }"
              :src="zoomSrc || src"
              v-on="{
                load: handleLoad,
                touchstart: handleDragStart,
                touchend: handleDragEnd,
                mousedown: handleDragStart,
                mouseup: handleDragEnd,
                click: handleClick,
              }"
            />

            <button
              v-if="isTouch && !hideCloseButton"
              type="button"
              class="iiz__btn iiz__close"
              aria-label="Zoom Out"
              :class="{ 'iiz__close--visible': isZoomed }"
              :style="{
                transition: `linear ${
                  isFullscreen ? 0 : fadeDuration
                }ms opacity, linear ${
                  isFullscreen ? 0 : fadeDuration
                }ms visibility`,
              }"
              v-on:click.stop="handleClose"
            />
          </div>
        </teleport>
      </template>

      <template v-else>
        <img
          class="iiz__zoom-img"
          alt=""
          :draggable="false"
          :class="{ 'iiz__zoom-img--visible': isZoomed }"
          :style="{
            top: `${top}px`,
            left: `${left}px`,
            transition: `linear ${
              isFullscreen ? 0 : fadeDuration
            }ms opacity, linear ${
              isFullscreen ? 0 : fadeDuration
            }ms visibility`,
          }"
          :src="zoomSrc || src"
          v-on="{
            load: handleLoad,
            touchstart: handleDragStart,
            touchend: handleDragEnd,
            mousedown: handleDragStart,
            mouseup: handleDragEnd,
          }"
        />

        <button
          v-if="isTouch && !hideCloseButton"
          class="iiz__btn iiz__close"
          type="button"
          aria-label="Zoom Out"
          :class="{ 'iiz__close--visible': isZoomed }"
          :style="{
            transition: `linear ${
              isFullscreen ? 0 : fadeDuration
            }ms opacity, linear ${
              isFullscreen ? 0 : fadeDuration
            }ms visibility`,
          }"
          v-on:click.stop="handleClose"
        />
      </template>
    </template>

    <span v-if="!isZoomed && !hideHint" class="iiz__btn iiz__hint"></span>
  </figure>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ImgPropsType } from "../types";

const props = defineProps({
  moveType: {
    type: String,
    default: "pan",
  },
  zoomType: {
    type: String,
    default: "click",
  },
  src: {
    type: String,
    required: true,
  },
  srcSet: String,
  sizes: String,
  sources: Array,
  width: Number,
  height: Number,
  hasSpacer: Boolean,
  zoomSrc: String,
  zoomScale: {
    type: Number,
    default: 1,
  },
  zoomPreload: Boolean,
  alt: String,
  fadeDuration: {
    type: Number,
    default: 150,
  },
  fullscreenOnMobile: Boolean,
  mobileBreakpoint: {
    type: Number,
    default: 640,
  },
  hideHint: Boolean,
  hideCloseButton: Boolean,
  className: String,
  afterZoomIn: Function,
  afterZoomOut: Function,
});

const isActive = ref(props.zoomPreload || false);
const isTouch = ref(false);
const isZoomed = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const currentMoveType = ref(props.moveType);
const left = ref(0);
const top = ref(0);
const imgProps = ref<ImgPropsType>({
  zoomImg: undefined,
  scaledDimensions: {
    width: 0,
    height: 0,
  },
  bounds: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  },
  ratios: {
    x: 0,
    y: 0,
  },
  offsets: {
    x: 0,
    y: 0,
  },
  onLoadCallback: null,
});
const imgRef = ref();

onMounted(() => {
  setDefaults();

  if (getFullscreenStatus(props.fullscreenOnMobile, props.mobileBreakpoint)) {
    isActive.value = false;
  }
});

const validSources = computed(() => {
  return props.sources?.filter((source: any) => source.srcSet) ?? [];
});

const createSpacer = computed(() => {
  return props.width && props.height && props.hasSpacer;
});

const handleMouseEnter = (e: any) => {
  isActive.value = true;
  if (props.zoomType === "hover" && !isZoomed.value) {
    handleClick(e);
  }
};

const handleTouchStart = () => {
  isTouch.value = true;
  isFullscreen.value = getFullscreenStatus(
    props.fullscreenOnMobile,
    props.mobileBreakpoint,
  );
  currentMoveType.value = "drag";
};

const handleClick = (e: any) => {
  if (isZoomed.value) {
    if (isTouch.value) {
      if (props.hideCloseButton) {
        handleClose();
      }
    } else if (!isDragging.value) {
      zoomOut();
    }
    return;
  }

  if (isTouch.value) {
    isActive.value = true;
  }

  if (imgProps.value.zoomImg) {
    handleLoad({ target: imgProps.value.zoomImg });
    zoomIn(e.pageX, e.pageY);
  } else {
    imgProps.value.onLoadCallback = zoomIn.bind(null, e.pageX, e.pageY);
  }
};

const handleLoad = (e: Event) => {
  const scaledDimensions = getScaledDimensions(e.target, props.zoomScale);
  imgProps.value.zoomImg = e.target as HTMLImageElement;
  imgProps.value.zoomImg.setAttribute(
    "width",
    scaledDimensions.width.toString(),
  );
  imgProps.value.zoomImg.setAttribute(
    "height",
    scaledDimensions.height.toString(),
  );
  imgProps.value.scaledDimensions = scaledDimensions;
  imgProps.value.bounds = getBounds(imgRef.value, false);
  imgProps.value.ratios = getRatios(imgProps.value.bounds, scaledDimensions);

  if (imgProps.value.onLoadCallback) {
    imgProps.value.onLoadCallback();
    imgProps.value.onLoadCallback = null;
  }
};

const handleMouseMove = (e: any) => {
  let leftVal = e.pageX - imgProps.value.offsets.x;
  let topVal = e.pageY - imgProps.value.offsets.y;

  leftVal = Math.max(Math.min(leftVal, imgProps.value.bounds.width), 0);
  topVal = Math.max(Math.min(topVal, imgProps.value.bounds.height), 0);

  left.value = leftVal * -imgProps.value.ratios.x;
  top.value = topVal * -imgProps.value.ratios.y;
};

const handleDragStart = (e: any) => {
  imgProps.value.offsets = getOffsets(
    e.pageX || e.changedTouches[0].pageX,
    e.pageY || e.changedTouches[0].pageY,
    imgProps.value.zoomImg?.offsetLeft,
    imgProps.value.zoomImg?.offsetTop,
  );

  imgProps.value.zoomImg?.addEventListener(
    isTouch.value ? "touchmove" : "mousemove",
    handleDragMove,
    {
      passive: true,
    },
  );

  if (!isTouch.value) {
    imgProps.value.eventPosition = {
      x: e.pageX,
      y: e.pageY,
    };
  }
};

const handleDragMove = (e: any) => {
  let leftVal =
    (e.pageX || e.changedTouches[0].pageX) - imgProps.value.offsets.x;
  let topVal =
    (e.pageY || e.changedTouches[0].pageY) - imgProps.value.offsets.y;

  leftVal = Math.max(
    Math.min(leftVal, 0),
    (imgProps.value.scaledDimensions.width - imgProps.value.bounds.width) * -1,
  );
  topVal = Math.max(
    Math.min(topVal, 0),
    (imgProps.value.scaledDimensions.height - imgProps.value.bounds.height) *
      -1,
  );

  left.value = leftVal;
  top.value = topVal;
};

const handleDragEnd = (e: any) => {
  imgProps.value.zoomImg?.removeEventListener(
    isTouch.value ? "touchmove" : "mousemove",
    handleDragMove,
  );

  if (!isTouch.value) {
    const moveX = Math.abs(e.pageX - imgProps.value.eventPosition?.x);
    const moveY = Math.abs(e.pageY - imgProps.value.eventPosition?.y);
    isDragging.value = moveX > 5 || moveY > 5;
  }
};

const handleMouseLeave = (e: any) => {
  if (currentMoveType.value === "drag" && isZoomed.value) {
    handleDragEnd(e);
  } else {
    handleClose();
  }
};

const handleClose = () => {
  zoomOut(() => {
    setTimeout(
      () => {
        if ((props.zoomPreload && isTouch.value) || !props.zoomPreload) {
          isActive.value = false;
          setDefaults();
        }

        isTouch.value = false;
        isFullscreen.value = false;
        currentMoveType.value = props.moveType;
      },
      isFullscreen.value ? 0 : props.fadeDuration,
    );
  });
};

const initialMove = (pageX: number, pageY: number) => {
  imgProps.value.offsets = getOffsets(
    window.pageXOffset,
    window.pageYOffset,
    -imgProps.value.bounds.left,
    -imgProps.value.bounds.top,
  );
  handleMouseMove({ pageX, pageY });
};

const initialDragMove = (pageX: number, pageY: number) => {
  let initialPageX =
    (pageX - (window.pageXOffset + imgProps.value.bounds.left)) *
    -imgProps.value.ratios.x;
  let initialPageY =
    (pageY - (window.pageYOffset + imgProps.value.bounds.top)) *
    -imgProps.value.ratios.y;

  initialPageX += isFullscreen.value
    ? (window.innerWidth - imgProps.value.bounds.width) / 2
    : 0;
  initialPageY += isFullscreen.value
    ? (window.innerHeight - imgProps.value.bounds.height) / 2
    : 0;

  imgProps.value.bounds = getBounds(imgRef.value, isFullscreen.value);
  imgProps.value.offsets = getOffsets(0, 0, 0, 0);

  handleDragMove({
    changedTouches: [
      {
        pageX: initialPageX,
        pageY: initialPageY,
      },
    ],
    preventDefault: () => {},
    stopPropagation: () => {},
  });
};

const zoomIn = (pageX: number, pageY: number) => {
  const initialMoveMethod =
    currentMoveType.value === "drag" ? initialDragMove : initialMove;

  isZoomed.value = true;
  initialMoveMethod(pageX, pageY);

  if (props.afterZoomIn) {
    props.afterZoomIn();
  }
};

const zoomOut = (callback?: () => void) => {
  isZoomed.value = false;

  if (props.afterZoomOut) {
    props.afterZoomOut();
  }

  if (callback) {
    callback();
  }
};

const setDefaults = () => {
  imgProps.value = {
    zoomImg: undefined,
    scaledDimensions: {
      width: 0,
      height: 0,
    },
    bounds: {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    },
    ratios: {
      x: 0,
      y: 0,
    },
    offsets: {
      x: 0,
      y: 0,
    },
    onLoadCallback: null,
  };
};

function getBounds(img: HTMLImageElement, isFullscreen: boolean) {
  if (isFullscreen) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      left: 0,
      top: 0,
    };
  }

  return img.getBoundingClientRect();
}

function getOffsets(pageX: number, pageY: number, left: number, top: number) {
  return {
    x: pageX - left,
    y: pageY - top,
  };
}

function getRatios(
  bounds: { width: number; height: number; left: number; top: number },
  dimensions: { width: any; height: any },
) {
  return {
    x: (dimensions.width - bounds.width) / bounds.width,
    y: (dimensions.height - bounds.height) / bounds.height,
  };
}

function getFullscreenStatus(
  fullscreenOnMobile: boolean,
  mobileBreakpoint: number,
) {
  return (
    fullscreenOnMobile &&
    window.matchMedia &&
    window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches
  );
}

function getScaledDimensions(zoomImg: HTMLImageElement, zoomScale: number) {
  return {
    width: zoomImg.naturalWidth * zoomScale,
    height: zoomImg.naturalHeight * zoomScale,
  };
}
</script>

<style scoped>
.iiz {
  max-width: 100%;
  margin: 0;
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor: zoom-in;
}

.iiz--drag .iiz__zoom-img--visible {
  cursor: grab;
}

.iiz__img {
  max-width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  visibility: visible;
  opacity: 1;
}

.iiz__img--hidden {
  visibility: hidden;
  opacity: 0;
}

.iiz__img--abs {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}

.iiz__zoom-img {
  width: auto !important;
  max-width: none !important;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  display: block;
}

.iiz__zoom-img--visible {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  cursor: zoom-out;
  -ms-touch-action: none;
  touch-action: none;
}

.iiz__zoom-portal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
}

.iiz__btn {
  background: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border: none;
  outline: none;
  padding: 0;
  position: absolute;
  text-decoration: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-appearance: none;
  appearance: none;
}

.iiz__btn:before {
  content: "";
  background-position: center;
  background-repeat: no-repeat;
  display: block;
}

.iiz__hint {
  bottom: 10px;
  right: 10px;
  pointer-events: none;
}

.iiz__hint:before {
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19.9 19.9'%3E%3Cpath d='M13.9 7.4C13.9 3.8 11 .9 7.4.9S.9 3.8.9 7.4s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5zm5.3 12.5l-6.7-7.2c-1.4 1.3-3.2 2.1-5.1 2.1-4.1 0-7.4-3.3-7.4-7.4S3.3 0 7.4 0s7.4 3.3 7.4 7.4c0 1.7-.6 3.4-1.7 4.7l6.8 7.2-.7.6z' fill='%23000222'/%3E%3C/svg%3E");
  width: 20px;
  height: 20px;
}

.iiz__close {
  top: 10px;
  right: 10px;
  visibility: hidden;
  opacity: 0;
}

.iiz__close--visible {
  visibility: visible;
  opacity: 1;
}

.iiz__close::before {
  content: "";
  width: 29px;
  height: 29px;
  background-image: linear-gradient(#222, #222), linear-gradient(#222, #222);
  background-size:
    100% 1px,
    1px 100%;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
