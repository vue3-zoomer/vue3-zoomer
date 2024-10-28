import { ref } from "vue";

export function useTransition() {
  const isTransition = ref(false);

  const startTransition = (time: number = 150) => {
    isTransition.value = true;
    setTimeout(() => {
      isTransition.value = false;
    }, time);
  };

  return { isTransition, startTransition };
}
