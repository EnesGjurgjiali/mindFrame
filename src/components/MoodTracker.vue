<script setup>
import { ref, watch, computed, defineProps } from "vue";
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

const { getMood, setMood: saveMood } = useMoods();
const selectedMood = ref(getMood(props.date) || null);

const moods = [
  { value: 1, emoji: "😞" },
  { value: 2, emoji: "😐" },
  { value: 3, emoji: "🙂" },
  { value: 4, emoji: "😄" },
  { value: 5, emoji: "😁" },
];

const selectedEmoji = computed(() => {
  if (!selectedMood.value) return null;
  const mood = moods.find((m) => m.value === selectedMood.value);
  return mood ? mood.emoji : null;
});

const setMood = (mood) => {
  if (!props.isEditable) return;
  selectedMood.value = mood;
  saveMood(props.date, mood);
};

watch(
  () => props.date,
  (newDate) => {
    selectedMood.value = getMood(newDate) || null;
  }
);
</script>

<template>
  <div class="flex items-center space-x-2">
    <span>{{ isEditable ? "How's your day going?" : "The day's mood was:" }}</span>
    <template v-if="isEditable">
      <button
        v-for="mood in moods"
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
  </div>
</template>
