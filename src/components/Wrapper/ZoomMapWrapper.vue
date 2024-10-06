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
    return {
      left: -zoomedImgOffset.value.left / (props.zoomScale * 4),
      top: -zoomedImgOffset.value.top / (props.zoomScale * 4),
    };
  }
});

const updateOffset = (newPosition?: PositionType) => {
  scale.value = 2;
  zoomedImgOffset.value = {
    left: -Number(newPosition?.left ?? 0) * (props.zoomScale * 4),
    top: -Number(newPosition?.top ?? 0) * (props.zoomScale * 4),
  };
};
</script>
