<script setup>
import { getTaskCardClass } from "../utils/taskUtils";
const props = defineProps({
  day: {
    type: Object,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="p-4 border rounded-lg shadow-sm">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-semibold">{{ day.name }}</h3>
      <p class="text-sm text-gray-600">{{ day.date.split("-")[2] }}</p>
    </div>
    <div class="space-y-2">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="text-xs p-1 rounded"
        :class="getTaskCardClass(task.type)"
      >
        {{ task.title }}
      </div>
    </div>
  </div>
</template>
