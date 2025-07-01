<script setup>
import { ref, computed } from "vue";
import { useTasks } from "../composables/useTasks";
import { toYYYYMMDD } from "../utils/date";
import { getTimelineTaskClass } from "../utils/taskUtils";
import { timeToMinutes, minutesToTime } from "../utils/time";

const props = defineProps({
  currentDate: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["change-date"]);

const { tasks, editTask } = useTasks();

const selectedDate = ref(props.currentDate);
const draggedTask = ref(null);
const dragStartX = ref(0);
const originalStartMinutes = ref(0);

const onDateChange = () => {
  emit("change-date", selectedDate.value);
};

const handleMouseDown = (event, task) => {
  draggedTask.value = task;
  dragStartX.value = event.clientX;
  originalStartMinutes.value = timeToMinutes(task.start);

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (event) => {
  if (!draggedTask.value) return;

  const deltaX = event.clientX - dragStartX.value;
  const deltaMinutes = Math.round(deltaX); // 1px = 1 minute

  const taskDuration =
    timeToMinutes(draggedTask.value.end) -
    timeToMinutes(draggedTask.value.start);
  let newStartMinutes = originalStartMinutes.value + deltaMinutes;

  // Constrain to day boundaries
  if (newStartMinutes < 0) newStartMinutes = 0;
  if (newStartMinutes + taskDuration > 1440)
    newStartMinutes = 1440 - taskDuration;

  draggedTask.value.start = minutesToTime(newStartMinutes);
  draggedTask.value.end = minutesToTime(newStartMinutes + taskDuration);
};

const handleMouseUp = () => {
  if (draggedTask.value) {
    editTask(draggedTask.value);
  }

  draggedTask.value = null;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
};

const tasksForSelectedDate = computed(() => {
  return tasks.value
    .filter(
      (task) => task.date === selectedDate.value && task.start && task.end
    )
    .sort((a, b) => a.start.localeCompare(b.start));
});

const getTaskStyle = (task) => {
  const startTotalMinutes = timeToMinutes(task.start);
  const endTotalMinutes = timeToMinutes(task.end);

  const topPosition =
    tasksForSelectedDate.value.findIndex((t) => t.id === task.id) * 48;

  return {
    left: `${startTotalMinutes}px`,
    width: `${endTotalMinutes - startTotalMinutes}px`,
    top: `${topPosition}px`,
    cursor: "grab",
  };
};
</script>

<template>
  <div class="text-gray-800">
    <h2 class="text-2xl font-bold mb-4 text-gray-900">Timeline View</h2>
    <input
      type="date"
      v-model="selectedDate"
      @change="onDateChange"
      class="mb-4 p-2 border rounded w-full max-w-xs"
    />

    <div class="relative h-[600px] overflow-x-auto border">
      <div class="relative min-w-[600px] w-[1440px] h-full">
        <!-- Hour markers -->
        <div
          v-for="hour in 24"
          :key="hour"
          class="absolute h-full border-r text-xs sm:text-sm text-gray-500"
          :style="{ left: `${(hour - 1) * 60}px` }"
        >
          <span class="absolute -top-5 left-1 text-xs sm:text-sm text-gray-500"
            >{{ hour - 1 }}:00</span
          >
        </div>

        <!-- Tasks -->
        <div
          v-for="task in tasksForSelectedDate"
          :key="task.id"
          class="timeline-task absolute h-10 rounded-lg p-2 text-white text-xs sm:text-sm"
          :style="getTaskStyle(task)"
          :class="getTimelineTaskClass(task.type)"
          @mousedown="handleMouseDown($event, task)"
        >
          {{ task.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-task {
  min-width: 100px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
