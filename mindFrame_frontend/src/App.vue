<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
import DayView from "./views/DayView.vue";
import WeekView from "./views/WeekView.vue";
import MonthView from "./views/MonthView.vue";
import TimelineView from "./views/TimelineView.vue";
import LoginRegisterModal from "./components/LoginRegisterModal.vue";
import Toast from "./components/Toast.vue";
import { toYYYYMMDD } from "./utils/date";
import { useTasks } from "./composables/useTasks";
import { useExpenses } from "./composables/useExpenses";
import { useMoods } from "./composables/useMoods";
import { useAuth } from "./composables/useAuth";

const currentView = ref("DayView");
const currentDate = ref(toYYYYMMDD(new Date()));
const showAuthModal = ref(false);

const views = {
  DayView,
  WeekView,
  MonthView,
  TimelineView,
};

const setView = (view) => {
  currentView.value = view;
};

const changeDate = (newDate) => {
  currentDate.value = newDate;
};

const setViewWithDate = ({ view, date }) => {
  currentView.value = view;
  currentDate.value = date;
};

// --- Refetch data after login/register or logout ---
const { fetchTasks } = useTasks();
const { fetchExpenses } = useExpenses();
const { fetchMoods } = useMoods();
const { logout } = useAuth();

function refetchAllData() {
  fetchTasks();
  fetchExpenses();
  fetchMoods();
}

function handleLogout() {
  logout();
  refetchAllData();
}
</script>

<template>
  <div id="app" class="bg-gray-100 min-h-screen w-full text-gray-800">
    <Header
      :currentView="currentView"
      @setView="setView"
      @open-auth-modal="showAuthModal = true"
      @logout="handleLogout"
    />
    <main class="p-2 sm:p-4 w-full max-w-auto mx-auto">
      <component
        :is="views[currentView]"
        :current-date="currentDate"
        @change-date="changeDate"
        v-if="currentView === 'DayView' || currentView === 'TimelineView'"
      />
      <component
        :is="views[currentView]"
        :current-date="currentDate"
        @change-date="changeDate"
        @set-view-with-date="setViewWithDate"
        v-else
      />
    </main>
    <LoginRegisterModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
      @auth-success="refetchAllData"
    />
    <Toast />
  </div>
</template>

<style></style>
