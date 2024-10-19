import { ref } from "vue";

export function useTransition() {
  const isTransition = ref(false);

  const startTransition = () => {
    isTransition.value = true;
    setTimeout(() => {
      isTransition.value = false;
    }, 250);
  };

  return { isTransition, startTransition };
}
