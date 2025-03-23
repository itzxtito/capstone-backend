const express = require("express");
const Recipe = require("../models/Recipe");
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Configure Multer for file storage
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Get all recipes (Supports Search & Category Filtering)
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get featured recipes (returns 6 random recipes)
router.get("/featured", async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([{ $sample: { size: 6 } }]); // Get 6 random recipes
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get a single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create a new recipe (Protected Route - User must be logged in)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { name, category, ingredients, instructions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !category || !ingredients || !instructions) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRecipe = new Recipe({
      name,
      category,
      ingredients: ingredients.split(","), // Ensure ingredients are an array
      instructions,
      image,
      author: req.user.username, // ✅ Assign logged-in user as author
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe submitted successfully!", newRecipe });
  } catch (err) {
    console.error("Recipe Submission Error:", err);
    res.status(400).json({ error: "Invalid data format" });
  }
});

// ✅ Update a recipe
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, ingredients, instructions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image; // Keep old image if no new upload

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, 
      { name, category, ingredients: ingredients.split(","), instructions, image },
      { new: true }
    );

    if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a recipe (Only author can delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      console.log("❌ Recipe not found:", req.params.id);
      return res.status(404).json({ error: "Recipe not found" });
    }

    console.log(`Attempting to delete: ${recipe.name} by ${recipe.author}`);
    console.log(`Request sent by: ${req.user.username}`);

    if (recipe.author !== req.user.username) {
      console.log("❌ Forbidden: Author mismatch");
      return res.status(403).json({ error: "You can only delete your own recipes" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    console.log("✅ Recipe deleted successfully");
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
