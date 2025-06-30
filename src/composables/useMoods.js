import { useLocalStorage } from "./useLocalStorage";

export function useMoods() {
  const moods = useLocalStorage("moods", {}); // Storing moods by date string 'YYYY-MM-DD'

  const getMood = (date) => {
    return moods.value[date];
  };

  const setMood = (date, mood) => {
    moods.value[date] = mood;
  };

  return {
    moods,
    getMood,
    setMood,
  };
}
