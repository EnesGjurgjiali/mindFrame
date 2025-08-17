<script setup>
import { ref, computed } from "vue";
import { useTasks } from "../composables/useTasks";
import DayCard from "../components/DayCard.vue";
import { toYYYYMMDD } from "../utils/date";
import { useExpenses } from "../composables/useExpenses";

const currentDate = ref(new Date());

const { tasks, loading: tasksLoading } = useTasks();
const { getExpensesByDate, loading: expensesLoading } = useExpenses();

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

const viewMode = ref("tasks"); // 'tasks' or 'expenses'

const weekExpenses = computed(() => {
  return week.value.map((day) => {
    const expenses = getExpensesByDate(day.date);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return { date: day.date, total };
  });
});
const weekTotal = computed(() =>
  weekExpenses.value.reduce((sum, d) => sum + d.total, 0)
);

const emit = defineEmits(["set-view-with-date"]);

const selectDay = (day) => {
  emit("set-view-with-date", { view: "DayView", date: day.date });
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Week View</h2>
    <div
      v-if="tasksLoading || expensesLoading"
      class="flex justify-center items-center py-8"
    >
      <span class="loader"></span>
    </div>
    <template v-else>
      <div class="flex gap-2 mb-4">
        <button
          :class="
            viewMode === 'tasks'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-l-lg font-semibold focus:outline-none"
          @click="viewMode = 'tasks'"
        >
          Tasks
        </button>
        <button
          :class="
            viewMode === 'expenses'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          class="px-4 py-2 rounded-r-lg font-semibold focus:outline-none"
          @click="viewMode = 'expenses'"
        >
          Expenses
        </button>
      </div>
      <div v-if="viewMode === 'tasks'">
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
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div
            v-for="day in week"
            :key="day.date"
            class="p-4 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center justify-center bg-white"
          >
            <div class="font-semibold mb-2">{{ day.name }}</div>
            <div class="text-2xl font-bold text-blue-600">
              {{
                weekExpenses
                  .find((d) => d.date === day.date)
                  ?.total.toFixed(2) || "0.00"
              }}
              €
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ day.date }}</div>
            <ul class="mt-2 w-full text-xs text-gray-500">
              <li
                v-for="expense in getExpensesByDate(day.date)"
                :key="expense._id"
              >
                {{ expense.description }}
                <span class="float-right"
                  >{{ expense.amount.toFixed(2) }} €</span
                >
              </li>
              <li
                v-if="getExpensesByDate(day.date).length === 0"
                class="italic text-gray-300"
              >
                No expenses
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-6 text-center">
          <span class="font-semibold text-lg">Total this week: </span>
          <span class="text-blue-600 font-bold text-lg"
            >{{ weekTotal.toFixed(2) }} €</span
          >
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.loader {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
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
