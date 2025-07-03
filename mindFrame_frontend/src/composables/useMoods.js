import { ref, watch } from "vue";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

const API_URL = "http://localhost:5000/api/moods";

export function useMoods() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const moods = ref({});

  // Fetch all moods from backend if authenticated
  const fetchMoods = async () => {
    if (!isAuthenticated.value) {
      moods.value = {};
      return;
    }
    try {
      const res = await axios.get(API_URL);
      // Convert array to object by date
      moods.value = Object.fromEntries(res.data.map((m) => [m.date, m.value]));
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    }
  };

  // Refetch when auth state changes
  watch(isAuthenticated, () => {
    fetchMoods();
  });

  fetchMoods();

  const getMood = (date) => {
    return moods.value[date];
  };

  const setMood = async (date, value) => {
    if (!isAuthenticated.value) {
      alert("Please log in to set your mood.");
      return;
    }
    try {
      const res = await axios.post(API_URL, { date, value });
      moods.value[date] = res.data.value;
      showToast("Mood saved!");
    } catch (err) {
      console.error("Failed to set mood:", err);
    }
  };

  return {
    moods,
    fetchMoods,
    getMood,
    setMood,
  };
}
