<template>
  <div class="relative">
    <MoveZoomImg
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="scale"
      :src="src"
      :zoom-scale="zoomScale"
      trigger="click"
    />
    <ZoomMap
      class="absolute -top-[26%] left-[1%] h-[25%] w-[25%] !border-2 !border-solid !border-white"
      :src="src"
      :zoom-scale="zoomScale"
      :position="windowPosition"
      @update:position="updateOffset"
    />
  </div>
</template>

<script setup lang="ts">
import MoveZoomImg from "~/components/MoveZoomImg.vue";
import ZoomMap from "~/components/ZoomMap.vue";
import { computed, ref } from "vue";
import { PositionType } from "~/types";
import { offset2pos, pos2offset } from "~/utilities/zoomCalculations";

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
    return offset2pos(zoomedImgOffset.value, props.zoomScale * 4);
  }
});

const updateOffset = (newPosition?: PositionType) => {
  scale.value = 2;
  const pos = { left: newPosition?.left ?? 0, top: newPosition?.top ?? 0 };

  //Multply scale by 4 because the map window is quarter the map container
  zoomedImgOffset.value = pos2offset(pos, props.zoomScale * 4);
};
</script>
