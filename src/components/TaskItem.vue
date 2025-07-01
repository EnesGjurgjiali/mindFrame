<script setup>
import { computed } from "vue";
import { taskEmojis, getTaskTypeClass } from "../utils/taskUtils";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(["delete", "edit", "toggle-completed"]);
</script>

<template>
  <div
    class="p-4 border rounded-lg shadow-sm flex justify-between items-center"
    :class="getTaskTypeClass(task.type)"
  >
    <div class="flex items-center w-full">
      <input
        type="checkbox"
        class="mr-4 accent-blue-500 h-5 w-5"
        :checked="task.completed"
        @change="$emit('toggle-completed', task.id)"
      />
      <span class="text-2xl mr-4">{{ taskEmojis[task.type] }}</span>
      <div :class="task.completed ? 'opacity-60 line-through' : ''">
        <h3 class="font-bold">
          {{ task.title }}
          <span v-if="task.rating" class="text-yellow-500 ml-2"
            >({{ task.rating }} ★)</span
          >
        </h3>
        <p class="text-sm text-gray-600">{{ task.start }} - {{ task.end }}</p>
        <p v-if="task.description" class="text-sm text-gray-500 mt-1">
          {{ task.description }}
        </p>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button
        @click="$emit('edit', task)"
        class="text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-1.414.586H4a2 2 0 01-2-2v-2.172a2 2 0 01.586-1.414l8-8zM12 5l-8 8v1h1l8-8-1-1z"
          />
        </svg>
      </button>
      <button
        @click="$emit('delete', task.id)"
        class="text-gray-500 hover:text-red-600 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
