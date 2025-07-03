import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
  date: { type: String, required: true },
  value: { type: Number, required: true }, // e.g., 1-5 scale
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add more fields as needed
});

MoodSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Mood", MoodSchema);
