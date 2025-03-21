const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  ingredients: [String],
  instructions: String,
  image: String,
  author: { type: String, required: true }, // ✅ New field: Author's username
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
