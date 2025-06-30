import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue);

  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    data.value = JSON.parse(storedValue);
  }

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return data;
}
