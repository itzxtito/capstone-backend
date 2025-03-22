const express = require("express");
const Recipe = require("../models/Recipe");
const multer = require("multer");
const path = require("path");

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

// ✅ Create a new recipe (Supports Image Upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, ingredients, instructions } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Save image path

    const newRecipe = new Recipe({
      name,
      category,
      ingredients: ingredients.split(","), // Convert string to array
      instructions,
      image
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ Update a recipe
router.put("/:id", upload.single("image"), async (req, res) => {
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

// ✅ Delete a recipe
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
