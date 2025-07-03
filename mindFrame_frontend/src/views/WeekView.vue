<script setup>
import { ref, computed } from "vue";
import { useTasks } from "../composables/useTasks";
import DayCard from "../components/DayCard.vue";
import { toYYYYMMDD } from "../utils/date";

const currentDate = ref(new Date());

const { tasks } = useTasks();

const tasksByDate = computed(() => {
  return tasks.value.reduce((acc, task) => {
    (acc[task.date] = acc[task.date] || []).push(task);
    return acc;
  }, {});
});

const week = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  const currentDay = startOfWeek.getDay();
  const date = startOfWeek.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to start on Monday
  startOfWeek.setDate(date);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    days.push({
      name: date.toLocaleDateString(undefined, { weekday: "short" }),
      date: toYYYYMMDD(date),
    });
  }
  return days;
});

const emit = defineEmits(["set-view-with-date"]);

const selectDay = (day) => {
  emit("set-view-with-date", { view: "DayView", date: day.date });
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Week View</h2>
    <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
      <DayCard
        v-for="day in week"
        :key="day.date"
        :day="day"
        :tasks="tasksByDate[day.date] || []"
        @click="selectDay(day)"
        class="cursor-pointer hover:bg-gray-100"
      />
    </div>
  </div>
</template>

<style scoped></style>
