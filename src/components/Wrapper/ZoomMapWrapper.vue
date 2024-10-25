<template>
  <div class="relative">
    <DragZoomImg
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="scale"
      class="h-full w-full"
      trigger="click"
      :src="src"
      :step="1"
      :zoom-scale="zoomScale"
      :presist="true"
    />
    <ZoomMap
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
import MoveZoomImg from "~/components/core/MoveZoomImg.vue";
import ZoomMap from "~/components/ZoomMap.vue";
import { computed, ref } from "vue";
import { PositionType } from "~/types";
import { offset2pos, pos2offset } from "~/utilities/zoomCalculations";
import DragZoomImg from "../core/DragZoomImg.vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  zoomScale: {
    type: Number,
    default: 2,
  },
});

const zoomedImgOffset = ref({ left: 0, top: 0 });
const scale = ref(1);

const windowPosition = computed(() => {
  if (scale.value !== 1) {
    //Multply scale by 4 because the map window is quarter the map container
    return offset2pos(zoomedImgOffset.value, scale.value * 4);
  }
});

const updateOffset = (newPosition?: PositionType) => {
  //Multply scale by 4 because the map window is quarter the map container
  if (newPosition)
    zoomedImgOffset.value = pos2offset(newPosition, scale.value * 4);
};
</script>
