<script setup>
import { ref, computed, watch } from "vue";
import { useExpenses } from "../composables/useExpenses";

const props = defineProps({
  date: { type: String, required: true }, // format: YYYY-MM-DD
});

const month = computed(() => props.date.slice(0, 7));

const {
  getExpensesByDate,
  getExpensesByMonth,
  addExpense,
  editExpense,
  deleteExpense: removeExpense,
  getTotalByDate,
  getTotalByMonth,
  getDailyBudget,
  setDailyBudget,
  getMonthlyBudget,
  setMonthlyBudget,
  loading,
} = useExpenses();

const form = ref({ amount: "", description: "" });
const editingId = ref(null);

const expensesToday = computed(() => getExpensesByDate(props.date));
const totalToday = computed(() => getTotalByDate(props.date));
const totalMonth = computed(() => getTotalByMonth(month.value));

const dailyBudget = ref(getDailyBudget(props.date));
const monthlyBudget = ref(getMonthlyBudget());
const dailyBudgetInput = ref(dailyBudget.value);
const monthlyBudgetInput = ref(monthlyBudget.value);

const collapsed = ref(false);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
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
      date: props.date,
      amount: parseFloat(form.value.amount),
      description: form.value.description,
    });
  }
  form.value = { amount: "", description: "" };
}

function startEdit(expense) {
  editingId.value = expense._id;
  form.value = {
    amount: expense.amount,
    description: expense.description || expense.note,
  };
}

function cancelEdit() {
  editingId.value = null;
  form.value = { amount: "", description: "" };
}

function deleteExpense(id) {
  removeExpense(id);
  if (editingId.value === id) {
    cancelEdit();
  }
}

function updateDailyBudget() {
  setDailyBudget(dailyBudgetInput.value, props.date);
  dailyBudget.value = getDailyBudget(props.date);
}
function updateMonthlyBudget() {
  setMonthlyBudget(monthlyBudgetInput.value);
  monthlyBudget.value = getMonthlyBudget();
}

// Keep budgets in sync if changed elsewhere
watch(
  () => getDailyBudget(props.date),
  (val) => {
    dailyBudget.value = val;
    dailyBudgetInput.value = val;
  }
);
watch(
  () => getMonthlyBudget(),
  (val) => {
    monthlyBudget.value = val;
    monthlyBudgetInput.value = val;
  }
);
</script>

<template>
  <div
    class="expense-tracker rounded-lg border border-gray-200 shadow p-2 sm:p-4 bg-white space-y-4 mt-6"
  >
    <div v-if="loading" class="flex justify-center items-center py-8">
      <span class="loader"></span>
    </div>
    <template v-else>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 cursor-pointer select-none hover:bg-gray-50 rounded transition"
        @click="toggleCollapse"
      >
        <h2 class="text-lg font-semibold mb-2 sm:mb-0">Expense Tracker</h2>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto"
        >
          <div class="flex space-x-2 w-full sm:w-auto" v-if="!collapsed">
            <label
              class="flex items-center text-sm w-full sm:w-auto"
              @click.stop
            >
              <span class="mr-1">Daily Budget:</span>
              <input
                type="number"
                v-model.number="dailyBudgetInput"
                @change="updateDailyBudget"
                min="0"
                class="w-full sm:w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </label>
            <label
              class="flex items-center text-sm w-full sm:w-auto"
              @click.stop
            >
              <span class="mr-1">Monthly Budget:</span>
              <input
                type="number"
                v-model.number="monthlyBudgetInput"
                @change="updateMonthlyBudget"
                min="0"
                class="w-full sm:w-24 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </label>
          </div>
          <span
            class="ml-0 sm:ml-2 p-1 rounded transition self-end sm:self-auto"
          >
            <svg
              :class="[
                'w-5 h-5 transition-transform',
                collapsed ? 'rotate-180' : 'rotate-0',
              ]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>
      <transition name="collapse-smooth">
        <div v-show="!collapsed" class="collapse-content">
          <div
            class="flex flex-col md:flex-row md:items-stretch gap-4 text-sm border-t border-gray-100 pt-2"
          >
            <div class="flex-1 flex flex-col gap-1">
              <div>
                <span class="font-medium">Spent Today: </span>
                <span class="text-red-600">{{ totalToday.toFixed(2) }} €</span>
              </div>
              <div>
                <span class="font-medium">Remaining Today: </span>
                <span
                  :class="
                    dailyBudget - totalToday < 0
                      ? 'text-red-600 font-semibold'
                      : 'text-green-600 font-semibold'
                  "
                >
                  {{ (dailyBudget - totalToday).toFixed(2) }} €
                </span>
              </div>
            </div>
            <div class="hidden md:block w-px bg-gray-200 mx-2"></div>
            <div
              class="flex-1 flex flex-col gap-1 md:pl-4 md:border-l md:border-gray-200 mt-2 md:mt-0"
            >
              <div>
                <span class="font-medium">Spent This Month: </span>
                <span class="text-red-600">{{ totalMonth.toFixed(2) }} €</span>
              </div>
              <div>
                <span class="font-medium">Remaining This Month: </span>
                <span
                  :class="
                    monthlyBudget - totalMonth < 0
                      ? 'text-red-600 font-semibold'
                      : 'text-green-600 font-semibold'
                  "
                >
                  {{ (monthlyBudget - totalMonth).toFixed(2) }} €
                </span>
              </div>
            </div>
          </div>
          <form
            @submit.prevent="onSubmit"
            class="flex flex-col sm:flex-row sm:items-end gap-2 border-t border-gray-100 pt-4"
          >
            <input
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount (€)"
              required
              class="px-2 py-1 border border-gray-300 rounded w-full sm:w-24 text-sm"
            />
            <input
              v-model="form.description"
              type="text"
              placeholder="Description"
              required
              class="px-2 py-1 border border-gray-300 rounded w-full flex-1 text-sm"
            />
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm w-full sm:w-auto"
              >
                {{ editingId ? "Update" : "Add" }}
              </button>
              <button
                v-if="editingId"
                type="button"
                @click="cancelEdit"
                class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
          <ul class="expense-list divide-y divide-gray-100">
            <li
              v-for="expense in expensesToday"
              :key="expense._id"
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-1 sm:gap-0"
            >
              <div>
                <span class="font-medium text-red-600"
                  >{{ expense.amount.toFixed(2) }} €</span
                >
                <span class="mx-2 text-gray-500">-</span>
                <span>{{ expense.description }}</span>
              </div>
              <div class="flex gap-2 mt-1 sm:mt-0">
                <button
                  @click="startEdit(expense)"
                  class="text-gray-500 hover:text-blue-600"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-1.414.586H4a2 2 0 01-2-2v-2.172a2 2 0 01.586-1.414l8-8zM12 5l-8 8v1h1l8-8-1-1z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteExpense(expense._id)"
                  class="text-gray-500 hover:text-red-600"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
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
            </li>
            <li
              v-if="expensesToday.length === 0"
              class="text-gray-400 text-sm py-2 text-center"
            >
              No expenses for today.
            </li>
          </ul>
        </div>
      </transition>
    </template>
  </div>
</template>

<style scoped>
.collapse-smooth-enter-active,
.collapse-smooth-leave-active {
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.collapse-smooth-enter-from,
.collapse-smooth-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-smooth-enter-to,
.collapse-smooth-leave-from {
  max-height: 2000px;
  opacity: 1;
}
.collapse-content {
  overflow: hidden;
}
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
