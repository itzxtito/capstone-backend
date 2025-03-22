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

// ✅ Create a new recipe (Supports Image Upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Received Data:", req.body); // ✅ Log incoming data for debugging

    const { name, category, ingredients, instructions, author } = req.body;
    if (!name || !category || !ingredients || !instructions || !author) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newRecipe = new Recipe({
      name,
      category,
      ingredients: ingredients.split(","), // Ensure ingredients are an array
      instructions,
      image,
      author,
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe submitted successfully!", newRecipe });
  } catch (err) {
    console.error("Recipe Submission Error:", err);
    res.status(400).json({ error: "Invalid data format" });
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

// ✅ Delete a recipe (Only author can delete)
router.delete("/:id", async (req, res) => {
  try {
    const { author } = req.body; // ✅ Ensure the author is being sent in the request body
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // ✅ Make sure only the author can delete the recipe
    if (recipe.author !== author) {
      return res.status(403).json({ error: "You can only delete your own recipes" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
