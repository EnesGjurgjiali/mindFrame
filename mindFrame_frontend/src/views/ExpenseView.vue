<script setup>
import { ref, computed, onMounted } from "vue";
import { useExpenses } from "../composables/useExpenses";
import { toYYYYMMDD } from "../utils/date";

const currentDate = ref(new Date());
const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const {
  expenses,
  loading,
  getExpensesByMonth,
  getTotalByMonth,
  getDailyBudget,
  setDailyBudget,
  getMonthlyBudget,
  setMonthlyBudget,
  addExpense,
  editExpense,
  deleteExpense,
} = useExpenses();

const form = ref({ amount: "", description: "" });
const editingId = ref(null);
const showAddForm = ref(false);

const monthString = computed(
  () =>
    `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, "0")}`
);

const monthExpenses = computed(() => getExpensesByMonth(monthString.value));
const monthTotal = computed(() => getTotalByMonth(monthString.value));
const monthlyBudget = ref(getMonthlyBudget());
const monthlyBudgetInput = ref(monthlyBudget.value);

const monthName = computed(() => {
  const date = new Date(selectedYear.value, selectedMonth.value);
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
});

const expensesByDay = computed(() => {
  const grouped = {};
  monthExpenses.value.forEach((expense) => {
    if (!grouped[expense.date]) {
      grouped[expense.date] = [];
    }
    grouped[expense.date].push(expense);
  });
  return grouped;
});

const averageDailyExpense = computed(() => {
  const daysWithExpenses = Object.keys(expensesByDay.value).length;
  return daysWithExpenses > 0 ? monthTotal.value / daysWithExpenses : 0;
});

const mostExpensiveDay = computed(() => {
  let maxDay = null;
  let maxAmount = 0;

  Object.entries(expensesByDay.value).forEach(([date, expenses]) => {
    const dayTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    if (dayTotal > maxAmount) {
      maxAmount = dayTotal;
      maxDay = date;
    }
  });

  return { date: maxDay, amount: maxAmount };
});

const recentExpenses = computed(() => {
  return expenses.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
});

function changeMonth(direction) {
  if (direction === "next") {
    if (selectedMonth.value === 11) {
      selectedMonth.value = 0;
      selectedYear.value++;
    } else {
      selectedMonth.value++;
    }
  } else {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11;
      selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
  }
}

function updateMonthlyBudget() {
  setMonthlyBudget(monthlyBudgetInput.value);
  monthlyBudget.value = getMonthlyBudget();
}

function onSubmit() {
  if (editingId.value) {
    editExpense(editingId.value, {
      amount: parseFloat(form.value.amount),
      description: form.value.description,
    });
    editingId.value = null;
  } else {
    addExpense({
      date: toYYYYMMDD(new Date()),
      amount: parseFloat(form.value.amount),
      description: form.value.description,
    });
  }
  form.value = { amount: "", description: "" };
  showAddForm.value = false;
}

function startEdit(expense) {
  editingId.value = expense._id;
  form.value = {
    amount: expense.amount,
    description: expense.description || expense.note,
  };
  showAddForm.value = true;
}

function cancelEdit() {
  editingId.value = null;
  form.value = { amount: "", description: "" };
  showAddForm.value = false;
}

function deleteExpenseHandler(id) {
  deleteExpense(id);
  if (editingId.value === id) {
    cancelEdit();
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Expense Overview</h2>
      <button
        @click="showAddForm = true"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        + Add Expense
      </button>
    </div>

    <!-- Month Navigation -->
    <div class="flex justify-between items-center mb-6">
      <button
        @click="changeMonth('prev')"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
      >
        &lt;
      </button>
      <h3 class="text-xl font-semibold text-gray-800">{{ monthName }}</h3>
      <button
        @click="changeMonth('next')"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
      >
        &gt;
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <span class="loader"></span>
    </div>

    <template v-else>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-medium text-gray-500">Total Spent</h4>
          <p class="text-2xl font-bold text-red-600">
            {{ monthTotal.toFixed(2) }} €
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-medium text-gray-500">Monthly Budget</h4>
          <div class="flex items-center gap-2">
            <input
              v-model.number="monthlyBudgetInput"
              @change="updateMonthlyBudget"
              type="number"
              class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span class="text-sm">€</span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-medium text-gray-500">Remaining</h4>
          <p
            class="text-2xl font-bold"
            :class="
              monthlyBudget - monthTotal < 0 ? 'text-red-600' : 'text-green-600'
            "
          >
            {{ (monthlyBudget - monthTotal).toFixed(2) }} €
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <h4 class="text-sm font-medium text-gray-500">Daily Average</h4>
          <p class="text-2xl font-bold text-blue-600">
            {{ averageDailyExpense.toFixed(2) }} €
          </p>
        </div>
      </div>

      <!-- Most Expensive Day -->
      <div
        v-if="mostExpensiveDay.date"
        class="bg-white p-4 rounded-lg shadow mb-6"
      >
        <h4 class="text-sm font-medium text-gray-500 mb-2">
          Most Expensive Day
        </h4>
        <p class="text-lg">
          <span class="font-semibold">{{
            formatDate(mostExpensiveDay.date)
          }}</span>
          <span class="text-red-600 font-bold ml-2"
            >{{ mostExpensiveDay.amount.toFixed(2) }} €</span
          >
        </p>
      </div>

      <!-- Add/Edit Expense Form -->
      <div v-if="showAddForm" class="bg-white p-4 rounded-lg shadow mb-6">
        <h4 class="text-lg font-semibold mb-4">
          {{ editingId ? "Edit" : "Add" }} Expense
        </h4>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Amount (€)</label
              >
              <input
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Description</label
              >
              <input
                v-model="form.description"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {{ editingId ? "Update" : "Add" }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Monthly Expenses by Day -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-4 border-b border-gray-200">
          <h4 class="text-lg font-semibold">Expenses by Day</h4>
        </div>
        <div class="p-4">
          <div
            v-if="Object.keys(expensesByDay).length === 0"
            class="text-center text-gray-500 py-8"
          >
            No expenses for this month
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="[date, dayExpenses] in Object.entries(expensesByDay).sort(
                (a, b) => b[0].localeCompare(a[0])
              )"
              :key="date"
              class="border border-gray-200 rounded-lg p-3"
            >
              <div class="flex justify-between items-center mb-2">
                <h5 class="font-semibold">{{ formatDate(date) }}</h5>
                <span class="text-red-600 font-bold">
                  {{
                    dayExpenses
                      .reduce((sum, exp) => sum + exp.amount, 0)
                      .toFixed(2)
                  }}
                  €
                </span>
              </div>
              <div class="space-y-1">
                <div
                  v-for="expense in dayExpenses"
                  :key="expense._id"
                  class="flex justify-between items-center text-sm"
                >
                  <span>{{ expense.description }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-red-600"
                      >{{ expense.amount.toFixed(2) }} €</span
                    >
                    <button
                      @click="startEdit(expense)"
                      class="text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="deleteExpenseHandler(expense._id)"
                      class="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
          <h4 class="text-lg font-semibold">Recent Expenses</h4>
        </div>
        <div class="p-4">
          <div
            v-if="recentExpenses.length === 0"
            class="text-center text-gray-500 py-8"
          >
            No recent expenses
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="expense in recentExpenses"
              :key="expense._id"
              class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <span class="font-medium">{{ expense.description }}</span>
                <span class="text-sm text-gray-500 ml-2">{{
                  formatDate(expense.date)
                }}</span>
              </div>
              <span class="text-red-600 font-semibold"
                >{{ expense.amount.toFixed(2) }} €</span
              >
            </div>
          </div>
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
