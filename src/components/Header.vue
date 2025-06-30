<script setup>
import { ref } from "vue";
import { useTasks } from "../composables/useTasks";
import { useMoods } from "../composables/useMoods";

defineProps({
  currentView: String,
});
const emit = defineEmits(["setView"]);

const isMenuOpen = ref(false);

const setView = (view) => {
  emit("setView", view);
  isMenuOpen.value = false;
};

const { tasks } = useTasks();
const { moods } = useMoods();
const importInput = ref(null);

const exportData = () => {
  const data = {
    tasks: tasks.value,
    moods: moods.value,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mindframe_backup_${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const triggerImport = () => {
  importInput.value.click();
};

const importData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.tasks) {
        tasks.value = data.tasks;
      }
      if (data.moods) {
        moods.value = data.moods;
      }
      alert("Data imported successfully!");
    } catch (error) {
      alert("Error importing data. Please check the file format.");
    }
  };
  reader.readAsText(file);
};
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">MindFrame</h1>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex items-center space-x-4">
        <button
          @click="$emit('setView', 'DayView')"
          :class="[
            'px-3 py-2 rounded',
            { 'bg-gray-700': currentView === 'DayView' },
          ]"
          class="cursor-pointer"
        >
          Day
        </button>
        <button
          @click="$emit('setView', 'WeekView')"
          :class="[
            'px-3 py-2 rounded',
            { 'bg-gray-700': currentView === 'WeekView' },
          ]"
          class="cursor-pointer"
        >
          Week
        </button>
        <button
          @click="$emit('setView', 'MonthView')"
          :class="[
            'px-3 py-2 rounded',
            { 'bg-gray-700': currentView === 'MonthView' },
          ]"
          class="cursor-pointer"
        >
          Month
        </button>
        <button
          @click="$emit('setView', 'TimelineView')"
          :class="[
            'px-3 py-2 rounded',
            { 'bg-gray-700': currentView === 'TimelineView' },
          ]"
          class="cursor-pointer"
        >
          Timeline
        </button>
      </nav>
      <div class="hidden md:flex items-center space-x-2">
        <button
          @click="exportData"
          class="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          Export
        </button>
        <button
          @click="triggerImport"
          class="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          Import
        </button>
        <input
          type="file"
          ref="importInput"
          @change="importData"
          class="hidden"
          accept="application/json"
        />
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="cursor-pointer">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isMenuOpen" class="md:hidden mt-4 origin-top-right">
        <nav class="flex flex-col space-y-2">
          <button
            @click="setView('DayView')"
            class="px-3 py-2 rounded text-left cursor-pointer"
            :class="{ 'bg-gray-700': currentView === 'DayView' }"
          >
            Day
          </button>
          <button
            @click="setView('WeekView')"
            class="px-3 py-2 rounded text-left cursor-pointer"
            :class="{ 'bg-gray-700': currentView === 'WeekView' }"
          >
            Week
          </button>
          <button
            @click="setView('MonthView')"
            class="px-3 py-2 rounded text-left cursor-pointer"
            :class="{ 'bg-gray-700': currentView === 'MonthView' }"
          >
            Month
          </button>
          <button
            @click="setView('TimelineView')"
            class="px-3 py-2 rounded text-left cursor-pointer"
            :class="{ 'bg-gray-700': currentView === 'TimelineView' }"
          >
            Timeline
          </button>
          <hr class="border-gray-600 my-2" />
          <button
            @click="exportData"
            class="px-3 py-2 rounded text-left hover:bg-gray-700 cursor-pointer"
          >
            Export
          </button>
          <button
            @click="triggerImport"
            class="px-3 py-2 rounded text-left hover:bg-gray-700 cursor-pointer"
          >
            Import
          </button>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped></style>
