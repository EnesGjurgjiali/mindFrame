<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const tab = ref("login");
const username = ref("");
const password = ref("");
const error = ref("");

const { login, register } = useAuth();

const activeTabClass =
  "flex-1 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold";
const inactiveTabClass =
  "flex-1 py-2 border-b-2 border-transparent text-gray-500";

const emit = defineEmits(["close", "auth-success"]);

const handleLogin = async () => {
  error.value = "";
  try {
    await login(username.value, password.value);
    username.value = "";
    password.value = "";
    error.value = "";
    emit("close");
    emit("auth-success");
  } catch (e) {
    error.value = e.response?.data?.message || "Login failed.";
  }
};

const handleRegister = async () => {
  error.value = "";
  try {
    await register(username.value, password.value);
    username.value = "";
    password.value = "";
    error.value = "";
    emit("close");
    emit("auth-success");
  } catch (e) {
    error.value = e.response?.data?.message || "Registration failed.";
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm flex items-center justify-center pt-10 pb-10 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
      <button
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        @click="$emit('close')"
      >
        &times;
      </button>
      <div class="flex mb-4 border-b">
        <button
          :class="tab === 'login' ? activeTabClass : inactiveTabClass"
          @click="tab = 'login'"
        >
          Login
        </button>
        <button
          :class="tab === 'register' ? activeTabClass : inactiveTabClass"
          @click="tab = 'register'"
        >
          Register
        </button>
      </div>
      <form
        @submit.prevent="tab === 'login' ? handleLogin() : handleRegister()"
      >
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div v-if="error" class="mb-2 text-red-600 text-sm">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {{ tab === "login" ? "Login" : "Register" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
