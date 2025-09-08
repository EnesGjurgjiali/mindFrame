import { ref, watch } from "vue";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

const EXPENSES_KEY = "expenses";
const DAILY_BUDGETS_KEY = "dailyBudgets";
const MONTHLY_BUDGETS_KEY = "monthlyBudgets";
const API_URL = "http://localhost:5000/api/expenses";

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
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const expenses = ref([]);
  const loading = ref(false);

  // Fetch all expenses from backend if authenticated
  const fetchExpenses = async () => {
    loading.value = true;
    if (!isAuthenticated.value) {
      expenses.value = [];
      loading.value = false;
      return;
    }
    try {
      const res = await axios.get(API_URL);
      // Map note to description for UI compatibility
      expenses.value = res.data.map((e) => ({
        ...e,
        description: e.description || e.note || "",
      }));
      loading.value = false;
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      loading.value = false;
    }
  };

  // Refetch when auth state changes
  watch(isAuthenticated, () => {
    fetchExpenses();
  });

  fetchExpenses();

  const addExpense = async ({ date, amount, description, note }) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to add expenses.", "error");
      return;
    }
    try {
      const newExpense = {
        date,
        amount: parseFloat(amount),
        note: note || description,
      };
      const res = await axios.post(API_URL, newExpense);
      expenses.value.push(res.data);
      showToast("Expense added!", "success");
      await fetchExpenses();
    } catch (err) {
      showToast("Failed to add expense.", "error");
      console.error("Failed to add expense:", err);
    }
  };

  const editExpense = async (id, updated) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to edit expenses.", "error");
      return;
    }
    try {
      const updatedExpense = { ...updated };
      if (updatedExpense.description) {
        updatedExpense.note = updatedExpense.description;
        delete updatedExpense.description;
      }
      const res = await axios.put(`${API_URL}/${id}`, updatedExpense);
      const idx = expenses.value.findIndex((e) => e._id === id || e.id === id);
      if (idx !== -1) {
        expenses.value[idx] = {
          ...res.data,
          description: res.data.description || res.data.note || "",
        };
      }
      showToast("Expense updated!", "success");
      await fetchExpenses();
    } catch (err) {
      showToast("Failed to edit expense.", "error");
      console.error("Failed to edit expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to delete expenses.", "error");
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      expenses.value = expenses.value.filter(
        (e) => e._id !== id && e.id !== id
      );
      showToast("Expense deleted!", "success");
      await fetchExpenses();
    } catch (err) {
      showToast("Failed to delete expense.", "error");
      console.error("Failed to delete expense:", err);
    }
  };

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
  function setDailyBudget(amount, date) {
    // date: 'YYYY-MM-DD'
    const budgets = JSON.parse(localStorage.getItem(DAILY_BUDGETS_KEY) || "{}");
    budgets[date] = amount;
    localStorage.setItem(DAILY_BUDGETS_KEY, JSON.stringify(budgets));
  }
  function getDailyBudget(date) {
    // date: 'YYYY-MM-DD'
    const budgets = JSON.parse(localStorage.getItem(DAILY_BUDGETS_KEY) || "{}");
    if (budgets[date] !== undefined) {
      return parseFloat(budgets[date]);
    }
    // Try previous days
    let prev = new Date(date);
    for (let i = 0; i < 30; i++) {
      // look back up to 30 days
      prev.setDate(prev.getDate() - 1);
      const prevStr = prev.toISOString().slice(0, 10);
      if (budgets[prevStr] !== undefined) {
        return parseFloat(budgets[prevStr]);
      }
    }
    return 0;
  }
  function setMonthlyBudget(amount, month) {
    // month: 'YYYY-MM'
    const budgets = JSON.parse(localStorage.getItem(MONTHLY_BUDGETS_KEY) || "{}");
    budgets[month] = amount;
    localStorage.setItem(MONTHLY_BUDGETS_KEY, JSON.stringify(budgets));
  }
  function getMonthlyBudget(month) {
    // month: 'YYYY-MM'
    const budgets = JSON.parse(localStorage.getItem(MONTHLY_BUDGETS_KEY) || "{}");
    if (budgets[month] !== undefined) {
      return parseFloat(budgets[month]);
    }
    // Try previous months
    let prev = new Date(month + "-01");
    for (let i = 0; i < 12; i++) {
      // look back up to 12 months
      prev.setMonth(prev.getMonth() - 1);
      const prevStr = prev.toISOString().slice(0, 7);
      if (budgets[prevStr] !== undefined) {
        return parseFloat(budgets[prevStr]);
      }
    }
    return 0;
  }

  return {
    expenses,
    fetchExpenses,
    loading,
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
