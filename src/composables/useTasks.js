import { computed } from "vue";
import { useLocalStorage } from "./useLocalStorage";
import { toYYYYMMDD } from "../utils/date";

export function useTasks(date = null) {
  const allTasks = useLocalStorage("tasks", []);

  const tasks = computed(() => {
    if (date && date.value) {
      return allTasks.value.filter((task) => task.date === date.value);
    }
    return allTasks.value;
  });

  const addTask = (task, taskDate) => {
    const newTaskDate =
      taskDate || (date && date.value) || toYYYYMMDD(new Date());
    allTasks.value.push({ ...task, id: Date.now(), date: newTaskDate });
  };

  const editTask = (updatedTask) => {
    const index = allTasks.value.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (index !== -1) {
      allTasks.value[index] = updatedTask;
    }
  };

  const deleteTask = (taskId) => {
    allTasks.value = allTasks.value.filter((task) => task.id !== taskId);
  };

  const updateTaskOrder = (newTasks) => {
    allTasks.value = newTasks;
  };

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
    updateTaskOrder,
  };
}
