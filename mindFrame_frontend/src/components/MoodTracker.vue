<script setup>
import { ref, watch, computed } from "vue";
import { useMoods } from "../composables/useMoods";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  isEditable: {
    type: Boolean,
    default: true,
  },
});

const { getMood, setMood: saveMood, moods, loading } = useMoods();
const selectedMood = ref(getMood(props.date) || null);

const moodOptions = [
  { value: 1, emoji: "😞" },
  { value: 2, emoji: "😐" },
  { value: 3, emoji: "🙂" },
  { value: 4, emoji: "😄" },
  { value: 5, emoji: "😁" },
];

const selectedEmoji = computed(() => {
  if (!selectedMood.value) return null;
  const mood = moodOptions.find((m) => m.value === selectedMood.value);
  return mood ? mood.emoji : null;
});

const setMood = (mood) => {
  if (!props.isEditable) return;
  selectedMood.value = mood;
  saveMood(props.date, mood);
};

watch(
  [() => props.date, () => moods.value[props.date]],
  ([newDate]) => {
    selectedMood.value = getMood(newDate) || null;
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex items-center space-x-2">
    <template v-if="loading">
      <span class="loader"></span>
    </template>
    <template v-else>
      <span>{{
        isEditable ? "How's your day going?" : "The day's mood was:"
      }}</span>
      <template v-if="isEditable">
        <button
          v-for="mood in moodOptions"
          :key="mood.value"
          @click="setMood(mood.value)"
          :class="[
            'p-2 rounded-full cursor-pointer',
            { 'bg-gray-300': selectedMood === mood.value },
          ]"
        >
          {{ mood.emoji }}
        </button>
      </template>
      <span v-else class="text-2xl">{{ selectedEmoji || "Not set" }}</span>
    </template>
  </div>
</template>

<style scoped>
.loader {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 8px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
