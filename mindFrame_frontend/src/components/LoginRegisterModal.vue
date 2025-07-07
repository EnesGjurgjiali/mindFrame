<script setup>
import { ref, watch } from "vue";
import { useAuth } from "../composables/useAuth";
import {
  UserIcon,
  LockClosedIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";

const tab = ref("login");
const username = ref("");
const password = ref("");
const error = ref("");
const captchaQuestion = ref("");
const captchaAnswer = ref("");
const userCaptchaInput = ref("");
const showPassword = ref(false);

const { login, register } = useAuth();

const activeTabClass =
  "flex-1 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold";
const inactiveTabClass =
  "flex-1 py-2 border-b-2 border-transparent text-gray-500";

const emit = defineEmits(["close", "auth-success"]);

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ops = ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let left = a,
    right = b;
  if (op === "-" && a < b) {
    left = b;
    right = a;
  }
  captchaQuestion.value = `${left} ${op} ${right}`;
  captchaAnswer.value = op === "+" ? left + right : left - right;
  userCaptchaInput.value = "";
}

watch(tab, (newTab) => {
  if (newTab === "register") generateCaptcha();
});

// Generate on mount if register tab is default
if (tab.value === "register") generateCaptcha();

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
    await register(
      username.value,
      password.value,
      captchaQuestion.value,
      userCaptchaInput.value
    );
    username.value = "";
    password.value = "";
    error.value = "";
    emit("close");
    emit("auth-success");
  } catch (e) {
    error.value = e.response?.data?.error || "Registration failed.";
    generateCaptcha(); // Regenerate on failure
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full backdrop-blur-sm flex items-center justify-center pt-10 pb-10 z-50"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-fade-in"
    >
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        @click="$emit('close')"
        aria-label="Close"
      >
        <XMarkIcon class="w-6 h-6 cursor-pointer" />
      </button>
      <div class="flex mb-6 border-b">
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
        autocomplete="off"
      >
        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-1 font-medium">Username</label>
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <UserIcon class="w-5 h-5" />
            </span>
            <input
              v-model="username"
              class="w-full border rounded-lg px-10 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              required
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700 mb-1 font-medium">Password</label>
          <div class="relative">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <LockClosedIcon class="w-5 h-5" />
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full border rounded-lg px-10 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition pr-10"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <component
                :is="showPassword ? EyeSlashIcon : EyeIcon"
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>
        <div v-if="tab === 'register'" class="mb-4">
          <label class="block text-gray-700 mb-1 font-medium"
            >CAPTCHA: What is {{ captchaQuestion }}?</label
          >
          <input
            v-model="userCaptchaInput"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            required
            autocomplete="off"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="Answer"
          />
        </div>
        <div v-if="error" class="mb-2 text-red-600 text-sm text-center">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2 shadow-md"
        >
          <span v-if="tab === 'login'">Login</span>
          <span v-else>Register</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
