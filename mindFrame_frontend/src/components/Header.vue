<script setup>
import { ref } from "vue";
import { useTasks } from "../composables/useTasks";
import { useMoods } from "../composables/useMoods";
import { useAuth } from "../composables/useAuth";
import {
  CalendarDaysIcon,
  CalendarIcon,
  Squares2X2Icon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  currentView: String,
});
const emit = defineEmits(["setView", "open-auth-modal", "logout"]);

const isMenuOpen = ref(false);

const setView = (view) => {
  emit("setView", view);
  isMenuOpen.value = false;
};

const { user, isAuthenticated } = useAuth();

const showLogoutConfirm = ref(false);

function confirmLogout() {
  emit("logout");
  showLogoutConfirm.value = false;
}

const navItems = [
  { view: "DayView", label: "Day", icon: CalendarDaysIcon },
  { view: "WeekView", label: "Week", icon: CalendarIcon },
  { view: "MonthView", label: "Month", icon: Squares2X2Icon },
  { view: "TimelineView", label: "Timeline", icon: ClockIcon },
];
</script>

<template>
  <header class="bg-gray-800 text-gray-100 p-4 w-full">
    <div class="container mx-auto flex justify-between items-center w-full">
      <div class="flex items-center space-x-2">
        <img
          src="/logo.png"
          alt="MindFrame Logo"
          class="h-10 w-10 object-contain cursor-pointer"
          @click="$emit('setView', 'DayView')"
        />
        <h1
          class="text-2xl font-bold text-gray-100 cursor-pointer"
          @click="$emit('setView', 'DayView')"
        >
          MindFrame
        </h1>
      </div>

      <!-- Desktop: Navigation + Auth Controls Grouped -->
      <div class="hidden md:flex items-center space-x-4">
        <button
          v-for="item in navItems"
          :key="item.view"
          @click="$emit('setView', item.view)"
          :class="[
            'px-3 py-2 rounded text-base sm:text-lg text-gray-100 flex items-center gap-1',
            { 'bg-gray-700': currentView === item.view },
          ]"
          class="cursor-pointer"
        >
          <component :is="item.icon" class="w-5 h-5 mr-1" />
          {{ item.label }}
        </button>
        <div class="ml-4 flex items-center gap-2">
          <template v-if="isAuthenticated">
            <UserIcon class="w-5 h-5 text-gray-300 mr-1" />
            <span class="text-gray-100 mr-2">{{ user.username }}</span>
            <button
              @click="showLogoutConfirm = true"
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" /> Logout
            </button>
          </template>
          <template v-else>
            <button
              @click="$emit('open-auth-modal')"
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <ArrowLeftOnRectangleIcon class="w-5 h-5" /> Login
            </button>
          </template>
        </div>
      </div>

      <!-- Mobile: Hamburger toggles nav+auth -->
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

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden mt-4 origin-top-right bg-gray-800 rounded shadow-lg p-4"
      >
        <nav class="flex flex-col space-y-2">
          <button
            v-for="item in navItems"
            :key="item.view"
            @click="
              $emit('setView', item.view);
              isMenuOpen = false;
            "
            :class="[
              'px-3 py-2 rounded text-left cursor-pointer text-base text-gray-100 flex items-center gap-1',
              { 'bg-gray-700': currentView === item.view },
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 mr-1" />
            {{ item.label }}
          </button>
          <hr class="border-gray-600 my-2" />
          <template v-if="isAuthenticated">
            <div class="flex items-center gap-2 mb-2">
              <UserIcon class="w-5 h-5 text-gray-300" />
              <span class="text-gray-100">{{ user.username }}</span>
            </div>
            <button
              @click="
                showLogoutConfirm = true;
                isMenuOpen = false;
              "
              class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" /> Logout
            </button>
          </template>
          <template v-else>
            <button
              @click="
                $emit('open-auth-modal');
                isMenuOpen = false;
              "
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <ArrowLeftOnRectangleIcon class="w-5 h-5" /> Login
            </button>
          </template>
        </nav>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm flex items-center justify-center pt-10 pb-10 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center"
      >
        <p class="mb-4 text-gray-800">Are you sure you want to logout?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirmLogout"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            @click="showLogoutConfirm = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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
