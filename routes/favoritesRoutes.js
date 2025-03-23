const express = require("express");
const User = require("../models/User");
const Recipe = require("../models/Recipe"); // ✅ Ensure Recipe model is imported

const router = express.Router();

// ✅ Save a recipe to favorites
router.post("/:username/favorites", async (req, res) => {
  const { username } = req.params;
  const { recipeId } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the recipe by recipeId
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Add only the recipe's ObjectId to the favorites array
    user.favorites.push(recipe._id);  // Use recipe._id (ObjectId)
    await user.save();

    res.status(200).json({ message: "Recipe added to favorites!" });
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all favorite recipes for a user
router.get("/:username/favorites", async (req, res) => {
  const { username } = req.params;
  console.log("Incoming GET favorites for:", username); // ✅ Log incoming request

  try {
    const user = await User.findOne({ username }).populate("favorites");
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Favorites found:", user.favorites);
    res.json(user.favorites);
  } catch (err) {
    console.error("❌ Error fetching favorites:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Remove a recipe from user's favorites
router.delete("/:username/favorites/:recipeId", async (req, res) => {
  const { username, recipeId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favorites.pull(recipeId); // Remove recipe from favorites array
    await user.save();

    res.status(200).json({ message: "Recipe removed from favorites!" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;
