<script setup>
import { useToast } from "../composables/useToast";
const { toastMessage, toastVisible } = useToast();
</script>

<template>
  <transition name="fade">
    <div
      v-if="toastVisible"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50"
    >
      {{ toastMessage }}
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
