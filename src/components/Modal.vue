<script setup>
import { ref, onMounted } from "vue";

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
  rating: "",
  description: "",
  repeat: "None",
});

onMounted(() => {
  if (props.task) {
    form.value = { repeat: "None", ...props.task };
    if (form.value.rating === 0) form.value.rating = "";
    if (!form.value.repeat) form.value.repeat = "None";
  }
});

const saveTask = () => {
  const toSave = { ...form.value };
  if (toSave.rating === "" || toSave.rating === null) {
    delete toSave.rating;
  }
  emit("save", toSave);
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm flex items-start justify-center pt-10 pb-10"
    id="my-modal"
    @click.self="$emit('close')"
  >
    <div
      class="relative mx-auto p-5 border border-gray-300 w-96 shadow-lg rounded-md bg-white"
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
            <label
              for="description"
              class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              v-model="form.description"
              id="description"
              rows="3"
              class="mt-1 p-2 w-full border rounded-md"
            ></textarea>
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
          <div class="mb-4">
            <label for="repeat" class="block text-sm font-medium text-gray-700"
              >Repeat</label
            >
            <select
              v-model="form.repeat"
              id="repeat"
              class="mt-1 p-2 w-full border rounded-md"
            >
              <option value="None">None</option>
              <option value="Every Day">Every Day</option>
              <option value="Weekdays Only">Weekdays Only</option>
              <option value="Weekends Only">Weekends Only</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="rating" class="block text-sm font-medium text-gray-700"
              >Rating (1-5)</label
            >
            <input
              type="number"
              v-model="form.rating"
              id="rating"
              min="1"
              max="5"
              class="mt-1 p-2 w-full border rounded-md"
            />
            <span class="text-xs text-gray-400">(Optional)</span>
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
