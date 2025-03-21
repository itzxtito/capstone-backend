const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ Save a recipe to favorites
router.post("/:email/favorites", async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findOne({ email: req.params.email });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }

    res.json({ message: "Recipe added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get all favorite recipes for a user
router.get("/:email/favorites", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate("favorites");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
