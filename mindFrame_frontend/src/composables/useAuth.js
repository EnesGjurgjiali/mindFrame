import { ref, computed } from "vue";
import axios from "axios";
import { useToast } from "./useToast";

const API_URL = "http://localhost:5000/api/auth";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const token = ref(localStorage.getItem(TOKEN_KEY) || "");
const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || "null"));

if (token.value) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
}

const isAuthenticated = computed(() => !!token.value);

const { showToast } = useToast();

const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  token.value = res.data.token;
  user.value = { _id: res.data._id, username: res.data.username };
  localStorage.setItem(TOKEN_KEY, token.value);
  localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  showToast("Logged in successfully!");
};

const register = async (username, password) => {
  const res = await axios.post(`${API_URL}/register`, { username, password });
  token.value = res.data.token;
  user.value = { _id: res.data._id, username: res.data.username };
  localStorage.setItem(TOKEN_KEY, token.value);
  localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  showToast("Registered and logged in!");
};

const logout = () => {
  token.value = "";
  user.value = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common["Authorization"];
  showToast("Logged out.");
};

export function useAuth() {
  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
