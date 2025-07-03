import { ref } from "vue";

const toastMessage = ref("");
const toastVisible = ref(false);
let timeoutId = null;

export function useToast() {
  function showToast(message, duration = 2500) {
    toastMessage.value = message;
    toastVisible.value = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      toastVisible.value = false;
      toastMessage.value = "";
    }, duration);
  }

  return {
    toastMessage,
    toastVisible,
    showToast,
  };
}
