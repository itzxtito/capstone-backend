const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ Register a new user (no password)
router.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get user data by email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email }).populate("favorites");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
