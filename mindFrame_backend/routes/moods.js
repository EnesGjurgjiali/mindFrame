import express from "express";
import Mood from "../models/Mood.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all moods for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update a mood for a date for the authenticated user
router.post("/", auth, async (req, res) => {
  try {
    const { date, value } = req.body;
    let mood = await Mood.findOneAndUpdate(
      { date, user: req.user._id },
      { value, user: req.user._id },
      { new: true, upsert: true }
    );
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
