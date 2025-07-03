import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
  type: String,
  start: String,
  end: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add more fields as needed
});

export default mongoose.model("Task", TaskSchema);
