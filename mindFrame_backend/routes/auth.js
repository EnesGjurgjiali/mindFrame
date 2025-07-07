import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Rate limiter for registration endpoint
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error:
      "Too many accounts created from this IP, please try again after an hour.",
  },
});

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerLimiter, async (req, res) => {
  const { username, password, captchaQuestion, captchaAnswer } = req.body;

  // Simple math captcha validation
  // captchaQuestion should be a string like "3 + 4"
  // captchaAnswer should be the user's answer (as string or number)
  if (!captchaQuestion || typeof captchaAnswer === "undefined") {
    return res.status(400).json({ error: "CAPTCHA is required." });
  }
  // Evaluate the math question safely
  const match = captchaQuestion.match(/^(\d+)\s*([+\-*/])\s*(\d+)$/);
  if (!match) {
    return res.status(400).json({ error: "Invalid CAPTCHA question format." });
  }
  const a = parseInt(match[1], 10);
  const op = match[2];
  const b = parseInt(match[3], 10);
  let correct;
  switch (op) {
    case "+":
      correct = a + b;
      break;
    case "-":
      correct = a - b;
      break;
    case "*":
      correct = a * b;
      break;
    case "/":
      correct = b !== 0 ? a / b : null;
      break;
    default:
      correct = null;
  }
  if (correct === null || Number(captchaAnswer) !== correct) {
    return res.status(400).json({ error: "Incorrect CAPTCHA answer." });
  }

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
