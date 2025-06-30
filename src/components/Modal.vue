<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  id: null,
  title: "",
  type: "Work",
  start: "",
  end: "",
});

onMounted(() => {
  if (props.task) {
    form.value = { ...props.task };
  }
});

const saveTask = () => {
  emit("save", form.value);
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    id="my-modal"
    @click.self="$emit('close')"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ form.id ? "Edit Task" : "Add Task" }}
        </h3>
        <form @submit.prevent="saveTask" class="mt-2 text-left">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700"
              >Title</label
            >
            <input
              type="text"
              v-model="form.title"
              id="title"
              class="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium text-gray-700"
              >Type</label
            >
            <select
              v-model="form.type"
              id="type"
              class="mt-1 p-2 w-full border rounded-md"
            >
              <option>Work</option>
              <option>Rest</option>
              <option>Study</option>
              <option>Personal</option>
              <option>Prayer</option>
              <option>Activity</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="start" class="block text-sm font-medium text-gray-700"
              >Start Time</label
            >
            <input
              type="time"
              v-model="form.start"
              id="start"
              class="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div class="mb-4">
            <label for="end" class="block text-sm font-medium text-gray-700"
              >End Time</label
            >
            <input
              type="time"
              v-model="form.end"
              id="end"
              class="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div class="items-center px-4 py-3">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            >
              Save
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
