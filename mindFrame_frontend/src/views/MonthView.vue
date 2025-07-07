<script setup>
import { ref, computed } from "vue";
import { useTasks } from "../composables/useTasks";
import { useMoods } from "../composables/useMoods";
import { toYYYYMMDD } from "../utils/date";
import { getTaskCardClass } from "../utils/taskUtils";
import { useExpenses } from "../composables/useExpenses";

const { tasks } = useTasks();
const { moods } = useMoods();
const { getExpensesByDate, getTotalByMonth } = useExpenses();
const today = toYYYYMMDD(new Date());

const tasksByDate = computed(() => {
  return tasks.value.reduce((acc, task) => {
    (acc[task.date] = acc[task.date] || []).push(task);
    return acc;
  }, {});
});

const moodEmojis = {
  1: "😞",
  2: "😐",
  3: "🙂",
  4: "😄",
  5: "😁",
};

const taskTypeClass = (type) => {
  switch (type) {
    case "Work":
      return "bg-blue-200 text-blue-800";
    case "Rest":
      return "bg-green-200 text-green-800";
    case "Study":
      return "bg-yellow-200 text-yellow-800";
    case "Personal":
      return "bg-purple-200 text-purple-800";
    case "Prayer":
      return "bg-indigo-200 text-indigo-800";
    case "Activity":
      return "bg-pink-200 text-pink-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const currentDate = ref(new Date());

const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const monthName = computed(() =>
  currentDate.value.toLocaleDateString(undefined, { month: "long" })
);
const dayNames = computed(() => {
  if (window.innerWidth < 768) {
    return ["M", "T", "W", "T", "F", "S", "S"];
  }
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
});

const days = computed(() => {
  const firstDayOfMonth = new Date(year.value, month.value, 1);
  const lastDayOfMonth = new Date(year.value, month.value + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Monday

  const daysArray = [];

  // Days from previous month
  const prevMonthLastDay = new Date(year.value, month.value, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    daysArray.push({
      date: new Date(year.value, month.value - 1, prevMonthLastDay - i),
      dayOfMonth: prevMonthLastDay - i,
      isCurrentMonth: false,
    });
  }

  // Days in current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({
      date: new Date(year.value, month.value, i),
      dayOfMonth: i,
      isCurrentMonth: true,
    });
  }

  // Days from next month
  const endDayOfWeek = (lastDayOfMonth.getDay() + 6) % 7; // 0 = Monday
  for (let i = 1; i < 7 - endDayOfWeek; i++) {
    daysArray.push({
      date: new Date(year.value, month.value + 1, i),
      dayOfMonth: i,
      isCurrentMonth: false,
    });
  }

  return daysArray.map((d) => ({
    ...d,
    date: toYYYYMMDD(d.date),
  }));
});

const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, 1);
};

const emit = defineEmits(["set-view-with-date"]);

const selectDay = (day) => {
  if (day.isCurrentMonth) {
    emit("set-view-with-date", { view: "DayView", date: day.date });
  }
};

const viewMode = ref("tasks"); // 'tasks' or 'expenses'

const monthString = computed(
  () => `${year.value}-${String(month.value + 1).padStart(2, "0")}`
);
const monthTotal = computed(() => getTotalByMonth(monthString.value));
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <button
        @click="prevMonth"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer"
      >
        &lt;
      </button>
      <h2 class="text-2xl font-bold text-gray-900">
        {{ monthName }} {{ year }}
      </h2>
      <button
        @click="nextMonth"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer"
      >
        &gt;
      </button>
    </div>
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
      <div class="overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-px sm:gap-1 bg-gray-200 border-l border-t border-gray-200 min-w-[500px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="py-2 text-center font-semibold bg-white border-r border-b border-gray-200 text-xs sm:text-sm text-gray-800"
          >
            {{ dayName }}
          </div>
          <div
            v-for="day in days"
            :key="day.date"
            class="p-2 h-32 bg-white border-r border-b border-gray-200 overflow-y-auto cursor-pointer hover:bg-gray-100 text-xs sm:text-sm text-gray-800"
            :class="{ 'bg-gray-50': !day.isCurrentMonth }"
            @click="selectDay(day)"
          >
            <div class="flex justify-between items-center">
              <div
                class="font-semibold"
                :class="{
                  'text-gray-400': !day.isCurrentMonth,
                  'text-white bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center':
                    day.date === today && day.isCurrentMonth,
                }"
              >
                {{ day.dayOfMonth }}
              </div>
              <div v-if="moods[day.date]" class="text-xl">
                {{ moodEmojis[moods[day.date]] }}
              </div>
            </div>
            <div class="mt-1 space-y-1">
              <div
                v-for="task in tasksByDate[day.date]"
                :key="task.id"
                class="text-xs p-1 rounded"
                :class="getTaskCardClass(task.type)"
              >
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-px sm:gap-1 bg-gray-200 border-l border-t border-gray-200 min-w-[500px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="py-2 text-center font-semibold bg-white border-r border-b border-gray-200 text-xs sm:text-sm text-gray-800"
          >
            {{ dayName }}
          </div>
          <div
            v-for="day in days"
            :key="day.date"
            class="p-2 h-32 bg-white border-r border-b border-gray-100 overflow-y-auto text-xs sm:text-sm text-gray-800"
            :class="{ 'bg-gray-50': !day.isCurrentMonth }"
          >
            <div class="flex justify-between items-center mb-1">
              <div
                class="font-semibold"
                :class="{
                  'text-gray-400': !day.isCurrentMonth,
                  'text-white bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center':
                    day.date === today && day.isCurrentMonth,
                }"
              >
                {{ day.dayOfMonth }}
              </div>
              <div class="text-xs text-blue-600 font-bold">
                {{
                  getExpensesByDate(day.date)
                    .reduce((sum, e) => sum + e.amount, 0)
                    .toFixed(2)
                }}
                €
              </div>
            </div>
            <ul
              class="mt-1 w-full text-xs text-gray-500 max-h-16 overflow-y-auto"
            >
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
      </div>
      <div class="mt-6 text-center">
        <span class="font-semibold text-lg">Total this month: </span>
        <span class="text-blue-600 font-bold text-lg"
          >{{ monthTotal.toFixed(2) }} €</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
