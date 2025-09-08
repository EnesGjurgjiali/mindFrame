import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { computed } from "vue";
import { useLocalStorage } from "./useLocalStorage";
import { toYYYYMMDD } from "../utils/date";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

const API_URL = "http://localhost:5000/api/tasks";

export function useTasks(date = null) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const allTasks = useLocalStorage("tasks", []);
  const loading = ref(false);

  const tasks = computed(() => {
    if (date && date.value) {
      return allTasks.value.filter((task) => task.date === date.value);
    }
    return allTasks.value;
  });

  // Fetch all tasks from backend if authenticated
  const fetchTasks = async () => {
    loading.value = true;
    if (!isAuthenticated.value) {
      allTasks.value = [];
      loading.value = false;
      return;
    }
    try {
      const res = await axios.get(API_URL);
      allTasks.value = res.data;
      loading.value = false;
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      loading.value = false;
    }
  };

  // Refetch when auth state changes
  watch(isAuthenticated, () => {
    fetchTasks();
  });

  onMounted(fetchTasks);

  // Add a new task
  const addTask = async (task, taskDate) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to add tasks.", "error");
      return;
    }
    try {
      const newTask = { ...task, date: taskDate || task.date };
      const res = await axios.post(API_URL, newTask);
      allTasks.value.push(res.data);
      showToast("Task added!", "success");
    } catch (err) {
      showToast("Failed to add task.", "error");
      console.error("Failed to add task:", err);
    }
  };

  // Edit a task
  const editTask = async (updatedTask) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to edit tasks.", "error");
      return;
    }
    try {
      const res = await axios.put(
        `${API_URL}/${updatedTask._id || updatedTask.id}`,
        updatedTask
      );
      // Update local state instantly
      const idx = allTasks.value.findIndex(
        (t) => t._id === res.data._id || t.id === res.data.id
      );
      if (idx !== -1) {
        allTasks.value[idx] = { ...res.data };
      }
      showToast("Task updated!", "success");
    } catch (err) {
      showToast("Failed to edit task.", "error");
      console.error("Failed to edit task:", err);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to delete tasks.", "error");
      return;
    }
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      allTasks.value = allTasks.value.filter(
        (t) => t._id !== taskId && t.id !== taskId
      );
      showToast("Task deleted!", "success");
    } catch (err) {
      showToast("Failed to delete task.", "error");
      console.error("Failed to delete task:", err);
    }
  };

  // Update task order (bulk update)
  const updateTaskOrder = async (newTasks) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to reorder tasks.", "error");
      return;
    }
    allTasks.value = newTasks;
  };

  // Toggle completion
  const toggleTaskCompletion = async (taskId) => {
    if (!isAuthenticated.value) {
      showToast("Please log in to complete tasks.", "error");
      return;
    }
    const task = allTasks.value.find(
      (t) => t._id === taskId || t.id === taskId
    );
    if (task) {
      await editTask({ ...task, completed: !task.completed });
    }
  };

  return {
    tasks,
    fetchTasks,
    loading,
    addTask,
    editTask,
    deleteTask,
    updateTaskOrder,
    toggleTaskCompletion,
  };
}
