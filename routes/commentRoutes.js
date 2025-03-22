const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

// ✅ Get comments for a recipe
router.get("/:recipeId", async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.recipeId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add a comment to a recipe
router.post("/:recipeId", async (req, res) => {
  try {
    const { username, text } = req.body;
    const newComment = new Comment({ recipeId: req.params.recipeId, username, text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

module.exports = router;
