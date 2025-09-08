import { ref } from "vue";

const toastMessage = ref("");
const toastVisible = ref(false);
const toastType = ref("success");
let timeoutId = null;

export function useToast() {
  function showToast(message, type = "success", duration = 2500) {
    toastMessage.value = message;
    toastType.value = type;
    toastVisible.value = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      toastVisible.value = false;
      toastMessage.value = "";
      toastType.value = "success";
    }, duration);
  }

  return {
    toastMessage,
    toastVisible,
    toastType,
    showToast,
  };
}
