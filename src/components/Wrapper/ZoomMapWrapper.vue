<template>
  <div class="relative">
    <MoveZoomImg
      v-model:zoomed-img-offset="zoomedImgOffset"
      v-model:current-scale="scale"
      trigger="click"
      :src="src"
      :step="1"
      :zoom-scale="zoomScale"
      :presist="true"
    />
    <ZoomMap
      v-show="windowPosition"
      class="absolute bottom-[25%] left-0 box-border h-[25%] w-[25%] p-2 outline outline-2 outline-offset-[-0.5rem] outline-white"
      :src="src"
      :zoom-scale="scale"
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
      left: -zoomedImgOffset.value.left / (scale.value * 4),
      top: -zoomedImgOffset.value.top / (scale.value * 4),
    };
  }
});

const updateOffset = (newPosition?: PositionType) => {
  zoomedImgOffset.value = {
    left: -Number(newPosition?.left ?? 0) * (scale.value * 4),
    top: -Number(newPosition?.top ?? 0) * (scale.value * 4),
  };
};
</script>
