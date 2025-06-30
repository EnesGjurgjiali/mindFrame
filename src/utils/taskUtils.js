export const taskEmojis = {
  Work: "💼",
  Rest: "😴",
  Study: "📚",
  Personal: "🏠",
  Prayer: "🙏",
  Activity: "🏃‍♂️",
};

export const getTaskTypeClass = (type) => {
  switch (type) {
    case "Work":
      return "bg-blue-100 border-blue-300";
    case "Rest":
      return "bg-green-100 border-green-300";
    case "Study":
      return "bg-yellow-100 border-yellow-300";
    case "Personal":
      return "bg-purple-100 border-purple-300";
    case "Prayer":
      return "bg-indigo-100 border-indigo-300";
    case "Activity":
      return "bg-pink-100 border-pink-300";
    default:
      return "bg-gray-100 border-gray-300";
  }
};

export const getTaskCardClass = (type) => {
  switch (type) {
    case "Work":
      return "bg-blue-200 text-blue-800";
    case "Rest":
      return "bg-green-200 text-green-800";
    case "Study":
      return "bg-yellow-200 text-yellow-800";
    case "Personal":
      return "bg-purple-200 text-purple-800";
    case "Prayer":
      return "bg-indigo-200 text-indigo-800";
    case "Activity":
      return "bg-pink-200 text-pink-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const getTimelineTaskClass = (type) => {
  switch (type) {
    case "Work":
      return "bg-blue-500";
    case "Rest":
      return "bg-green-500";
    case "Study":
      return "bg-yellow-500";
    case "Personal":
      return "bg-purple-500";
    case "Prayer":
      return "bg-indigo-500";
    case "Activity":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};
