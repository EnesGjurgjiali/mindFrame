<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
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
  return props.currentDate === today;
});

const { tasks, addTask, editTask, deleteTask, updateTaskOrder } = useTasks();
const showModal = ref(false);
const editingTask = ref(null);

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
  if (task.id) {
    editTask(task);
  } else {
    addTask(task, props.currentDate);
  }
  closeModal();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <button
        @click="changeDay(-1)"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer"
      >
        &lt; Prev
      </button>
      <div class="text-center">
        <h2 class="text-xl font-semibold">Day View</h2>
        <p class="text-gray-600">{{ formattedDate }}</p>
      </div>
      <button
        @click="changeDay(1)"
        class="px-4 py-2 bg-gray-200 rounded cursor-pointer"
      >
        Next &gt;
      </button>
    </div>

    <MoodTracker
      v-if="showMoodTracker"
      :date="currentDate"
      :is-editable="isMoodEditable"
      class="mb-4"
    />

    <draggable
      v-model="tasksForDay"
      tag="div"
      item-key="id"
      class="space-y-4 cursor-move"
      @end="onDragEnd"
    >
      <template #item="{ element: task }">
        <TaskItem
          :task="task"
          @edit="openModal(task)"
          @delete="deleteTask(task.id)"
        />
      </template>
    </draggable>

    <Modal
      v-if="showModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSaveTask"
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

  <div class="relative flex items-center my-8">
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
