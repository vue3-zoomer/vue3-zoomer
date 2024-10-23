import { ref } from "vue";

export function useTransition() {
  const isTransition = ref(false);

  const startTransition = (time: number) => {
    isTransition.value = true;
    setTimeout(() => {
      isTransition.value = false;
    }, time || 250);
  };

  return { isTransition, startTransition };
}
