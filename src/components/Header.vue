<script setup>
import { ref } from "vue";
import { useTasks } from "../composables/useTasks";
import { useMoods } from "../composables/useMoods";

defineProps({
  currentView: String,
});
const emit = defineEmits(["setView"]);

const isMenuOpen = ref(false);
const isDesktopMenuOpen = ref(false);

const setView = (view) => {
  emit("setView", view);
  isMenuOpen.value = false;
};

const { tasks } = useTasks();
const { moods } = useMoods();
const importInput = ref(null);

const exportData = () => {
  console.log("Export triggered");
  const data = {
    tasks: tasks.value,
    moods: moods.value,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `mindframe_backup_${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Export finished");
  }, 100);
};

const triggerImport = () => {
  if (importInput.value) importInput.value.value = null;
  importInput.value?.click();
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

function closeDesktopMenu() {
  isDesktopMenuOpen.value = false;
}
</script>

<template>
  <header class="bg-gray-800 text-gray-100 p-4 w-full">
    <div class="container mx-auto flex justify-between items-center w-full">
      <h1 class="text-2xl font-bold text-gray-100">MindFrame</h1>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex items-center space-x-4 overflow-x-auto">
        <button
          @click="$emit('setView', 'DayView')"
          :class="[
            'px-3 py-2 rounded text-base sm:text-lg text-gray-100',
            { 'bg-gray-700': currentView === 'DayView' },
          ]"
          class="cursor-pointer"
        >
          Day
        </button>
        <button
          @click="$emit('setView', 'WeekView')"
          :class="[
            'px-3 py-2 rounded text-base sm:text-lg text-gray-100',
            { 'bg-gray-700': currentView === 'WeekView' },
          ]"
          class="cursor-pointer"
        >
          Week
        </button>
        <button
          @click="$emit('setView', 'MonthView')"
          :class="[
            'px-3 py-2 rounded text-base sm:text-lg text-gray-100',
            { 'bg-gray-700': currentView === 'MonthView' },
          ]"
          class="cursor-pointer"
        >
          Month
        </button>
        <button
          @click="$emit('setView', 'TimelineView')"
          :class="[
            'px-3 py-2 rounded text-base sm:text-lg text-gray-100',
            { 'bg-gray-700': currentView === 'TimelineView' },
          ]"
          class="cursor-pointer"
        >
          Timeline
        </button>
        <!-- Desktop Hamburger -->
        <div class="relative ml-2">
          <button
            @click="isDesktopMenuOpen = true"
            class="p-2 rounded hover:bg-gray-700 focus:outline-none"
          >
            <svg
              class="w-6 h-6 text-gray-100"
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
              />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="cursor-pointer p-2 rounded hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6 text-gray-100"
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

    <!-- Desktop Sidebar -->
    <transition name="sidebar-fade">
      <div v-if="isDesktopMenuOpen" class="fixed inset-0 z-50 flex">
        <!-- Backdrop -->
        <div class="fixed inset-0" @click="closeDesktopMenu"></div>
        <!-- Sidebar -->
        <div
          class="ml-auto w-64 bg-gray-800 h-full shadow-lg relative flex flex-col animate-slide-in"
        >
          <button
            @click="closeDesktopMenu"
            class="absolute top-3 right-3 p-2 rounded hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6 text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div class="mt-16 flex flex-col gap-2 px-6">
            <button
              @click="
                exportData();
                closeDesktopMenu();
              "
              class="block w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700 rounded"
            >
              Export
            </button>
            <button
              @click="
                triggerImport();
                closeDesktopMenu();
              "
              class="block w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700 rounded"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </transition>

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
            class="px-3 py-2 rounded text-left cursor-pointer text-base text-gray-100"
            :class="{ 'bg-gray-700': currentView === 'DayView' }"
          >
            Day
          </button>
          <button
            @click="setView('WeekView')"
            class="px-3 py-2 rounded text-left cursor-pointer text-base text-gray-100"
            :class="{ 'bg-gray-700': currentView === 'WeekView' }"
          >
            Week
          </button>
          <button
            @click="setView('MonthView')"
            class="px-3 py-2 rounded text-left cursor-pointer text-base text-gray-100"
            :class="{ 'bg-gray-700': currentView === 'MonthView' }"
          >
            Month
          </button>
          <button
            @click="setView('TimelineView')"
            class="px-3 py-2 rounded text-left cursor-pointer text-base text-gray-100"
            :class="{ 'bg-gray-700': currentView === 'TimelineView' }"
          >
            Timeline
          </button>
          <hr class="border-gray-600 my-2" />
          <button
            @click="
              exportData();
              isMenuOpen = false;
            "
            class="px-3 py-2 rounded text-left hover:bg-gray-700 cursor-pointer text-base text-gray-300"
          >
            Export
          </button>
          <button
            @click="
              triggerImport();
              isMenuOpen = false;
            "
            class="px-3 py-2 rounded text-left hover:bg-gray-700 cursor-pointer text-base text-gray-300"
          >
            Import
          </button>
        </nav>
      </div>
    </transition>

    <!-- Global file input for import (used by both desktop and mobile) -->
    <input
      type="file"
      ref="importInput"
      @change="importData"
      class="hidden"
      accept="application/json"
    />
  </header>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.animate-slide-in {
  animation: slide-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.2s;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}
</style>
