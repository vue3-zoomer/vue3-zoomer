<template>
  <div class="relative">
    <MoveZoomImg
      v-if="zoomType === 'move'"
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="scale"
      v-bind="props"
      :class="{ 'h-full w-full': showImgMap }"
    />
    <DragZoomImg
      v-else
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="scale"
      v-bind="props"
      :class="{ 'h-full w-full': showImgMap }"
    />

    <ZoomMap
      v-if="showImgMap"
      v-show="windowPosition"
      class="absolute bottom-[28%] left-0 box-content h-[25%] w-[25%] border-8 border-transparent outline outline-2 outline-offset-[-8px] outline-white"
      :src="src"
      :zoom-scale="scale"
      :position="windowPosition"
      @update:position="updateOffset"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType, computed, ref } from "vue";
import type { PositionType } from "~/types";
import { offset2pos, pos2offset } from "~/utils/zoom";
import DragZoomImg from "~/components/core/DragZoomImg.vue";
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import ZoomMap from "~/components/core/ZoomMap.vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
  trigger: {
    type: String as PropType<"click" | "hover">,
    default: "click",
  },
  zoomType: {
    type: String as PropType<"move" | "drag">,
    default: "move",
  },
  step: {
    type: Number,
  },
  persist: {
    type: Boolean,
  },
  showImgMap: {
    type: Boolean,
  },
});

const zoomedImgOffset = ref({ left: 0, top: 0 });
const scale = ref(1);

const windowPosition = computed(() => {
  if (scale.value !== 1) {
    //Multiply scale by 4 because the map window is quarter the map container
    return offset2pos(zoomedImgOffset.value, scale.value * 4);
  }
});

const updateOffset = (newPosition?: PositionType) => {
  //Multiply scale by 4 because the map window is quarter the map container
  if (newPosition)
    zoomedImgOffset.value = pos2offset(newPosition, scale.value * 4);
};
</script>
