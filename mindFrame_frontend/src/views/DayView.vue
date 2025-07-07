<script setup>
import { ref, computed } from "vue";
import draggable from "vuedraggable";
import { useTasks } from "../composables/useTasks";
import TaskItem from "../components/TaskItem.vue";
import Modal from "../components/Modal.vue";
import MoodTracker from "../components/MoodTracker.vue";
import ExpenseTracker from "../components/ExpenseTracker.vue";
import { toYYYYMMDD } from "../utils/date";

const props = defineProps({
  currentDate: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["change-date"]);

const today = toYYYYMMDD(new Date());

const showMoodTracker = computed(() => {
  return props.currentDate <= today;
});

const isMoodEditable = computed(() => {
  return props.currentDate <= today;
});

const {
  tasks,
  addTask,
  editTask,
  deleteTask,
  updateTaskOrder,
  toggleTaskCompletion,
} = useTasks();
const showModal = ref(false);
const editingTask = ref(null);
const showCompleted = ref(false);

const tasksForDay = computed({
  get() {
    return tasks.value.filter((task) => task.date === props.currentDate);
  },
  set(newTasks) {
    const otherTasks = tasks.value.filter(
      (task) => task.date !== props.currentDate
    );
    updateTaskOrder([...otherTasks, ...newTasks]);
  },
});

const visibleTasksForDay = computed(() => {
  return tasksForDay.value.filter(
    (task) => showCompleted.value || !task.completed
  );
});

const onDragEnd = () => {
  // The v-model on draggable handles the update, this is just a hook if needed.
  // The 'set' part of the computed property 'tasksForDay' will be triggered.
};

const formattedDate = computed(() => {
  const date = new Date(props.currentDate.replace(/-/g, "/"));
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const openModal = (task = null) => {
  editingTask.value = task;
  showModal.value = true;
};

const closeModal = () => {
  editingTask.value = null;
  showModal.value = false;
};

const changeDay = (offset) => {
  const current = new Date(props.currentDate.replace(/-/g, "/"));
  current.setDate(current.getDate() + offset);
  emit("change-date", toYYYYMMDD(current));
};

const handleSaveTask = (task) => {
  const repeat = task.repeat || "None";
  if (task._id || repeat === "None") {
    if (task._id) {
      editTask(task);
    } else {
      addTask(task, props.currentDate);
    }
  } else {
    // Generate dates for the current week
    const baseDate = new Date(props.currentDate.replace(/-/g, "/"));
    const weekStart = new Date(baseDate);
    weekStart.setDate(baseDate.getDate() - baseDate.getDay()); // Sunday
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const day = d.getDay();
      if (
        repeat === "Every Day" ||
        (repeat === "Weekdays Only" && day >= 1 && day <= 5) ||
        (repeat === "Weekends Only" && (day === 0 || day === 6))
      ) {
        const isCurrent = toYYYYMMDD(d) === props.currentDate;
        addTask(
          {
            ...task,
            repeat: undefined,
            description: isCurrent ? task.description : "",
          },
          toYYYYMMDD(d)
        );
      }
    }
  }
  closeModal();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <button
        @click="changeDay(-1)"
        class="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded cursor-pointer flex items-center justify-center text-lg sm:text-base"
      >
        <svg
          class="w-5 h-5 sm:hidden"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="hidden sm:inline">&lt; Prev</span>
      </button>
      <div class="text-center">
        <h2 class="text-xl font-semibold text-gray-900">Day View</h2>
        <p class="text-gray-600">{{ formattedDate }}</p>
      </div>
      <button
        @click="changeDay(1)"
        class="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded cursor-pointer flex items-center justify-center text-lg sm:text-base"
      >
        <span class="hidden sm:inline">Next &gt;</span>
        <svg
          class="w-5 h-5 sm:hidden"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <MoodTracker
      v-if="showMoodTracker"
      :date="currentDate"
      :is-editable="isMoodEditable"
      class="mb-4"
    />

    <div class="flex items-center mb-2">
      <input
        type="checkbox"
        id="showCompleted"
        v-model="showCompleted"
        class="mr-2 accent-blue-500"
      />
      <label for="showCompleted" class="text-sm text-gray-700 select-none"
        >Show completed tasks</label
      >
    </div>

    <draggable
      v-model="tasksForDay"
      tag="div"
      item-key="id"
      class="space-y-4 cursor-move"
      @end="onDragEnd"
    >
      <template #item="{ element: task }">
        <TaskItem
          v-if="showCompleted || !task.completed"
          :task="task"
          @edit="openModal(task)"
          @delete="deleteTask(task._id)"
          @toggle-completed="toggleTaskCompletion"
        />
      </template>
    </draggable>

    <Modal
      v-if="showModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSaveTask"
      class="z-10"
    />
  </div>

  <div class="flex justify-center mt-4">
    <button
      @click="openModal()"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
    >
      + Add Task
    </button>
  </div>

  <div class="relative flex items-center my-8 z-0">
    <div class="flex-grow border-t border-gray-200"></div>
    <span
      class="mx-4 text-gray-400 font-semibold tracking-wide uppercase text-xs bg-white px-2"
      >Expenses</span
    >
    <div class="flex-grow border-t border-gray-200"></div>
  </div>

  <ExpenseTracker :date="currentDate" />
</template>

<style scoped></style>
