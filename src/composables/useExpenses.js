import { ref } from "vue";

const EXPENSES_KEY = "expenses";
const DAILY_BUDGET_KEY = "dailyBudget";
const MONTHLY_BUDGET_KEY = "monthlyBudget";

function loadExpenses() {
  return JSON.parse(localStorage.getItem(EXPENSES_KEY) || "[]");
}

function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export function useExpenses() {
  const expenses = ref(loadExpenses());

  function addExpense({ date, amount, description, category }) {
    const newExpense = {
      id: generateId(),
      date,
      amount: parseFloat(amount),
      description,
      category,
    };
    expenses.value.push(newExpense);
    saveExpenses(expenses.value);
  }

  function editExpense(id, updated) {
    const idx = expenses.value.findIndex((e) => e.id === id);
    if (idx !== -1) {
      expenses.value[idx] = { ...expenses.value[idx], ...updated };
      saveExpenses(expenses.value);
    }
  }

  function deleteExpense(id) {
    expenses.value = expenses.value.filter((e) => e.id !== id);
    saveExpenses(expenses.value);
  }

  function getExpensesByDate(date) {
    return expenses.value.filter((e) => e.date === date);
  }

  function getExpensesByMonth(month) {
    // month: 'YYYY-MM'
    return expenses.value.filter((e) => e.date.startsWith(month));
  }

  function getTotalByDate(date) {
    return getExpensesByDate(date).reduce((sum, e) => sum + e.amount, 0);
  }

  function getTotalByMonth(month) {
    return getExpensesByMonth(month).reduce((sum, e) => sum + e.amount, 0);
  }

  // Budget functions
  function setDailyBudget(amount) {
    localStorage.setItem(DAILY_BUDGET_KEY, amount);
  }
  function getDailyBudget() {
    return parseFloat(localStorage.getItem(DAILY_BUDGET_KEY) || "0");
  }
  function setMonthlyBudget(amount) {
    localStorage.setItem(MONTHLY_BUDGET_KEY, amount);
  }
  function getMonthlyBudget() {
    return parseFloat(localStorage.getItem(MONTHLY_BUDGET_KEY) || "0");
  }

  return {
    expenses,
    addExpense,
    editExpense,
    deleteExpense,
    getExpensesByDate,
    getExpensesByMonth,
    getTotalByDate,
    getTotalByMonth,
    setDailyBudget,
    getDailyBudget,
    setMonthlyBudget,
    getMonthlyBudget,
  };
}
