<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
import DayView from "./views/DayView.vue";
import WeekView from "./views/WeekView.vue";
import MonthView from "./views/MonthView.vue";
import TimelineView from "./views/TimelineView.vue";
import { toYYYYMMDD } from "./utils/date";

const currentView = ref("DayView");
const currentDate = ref(toYYYYMMDD(new Date()));

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
</script>

<template>
  <div id="app" class="bg-gray-100 min-h-screen w-full text-gray-800">
    <Header :currentView="currentView" @setView="setView" />
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
  </div>
</template>

<style></style>
