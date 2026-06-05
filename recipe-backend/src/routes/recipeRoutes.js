const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, removeRecipeFromGroup, deleteRecipe, updateRecipe } = require('../controllers/recipeController');

router.post('/', createRecipe);
router.get('/', getRecipes);
router.put('/:id', updateRecipe);
router.put('/:id/remove-group', removeRecipeFromGroup);
router.delete('/:id', deleteRecipe);

module.exports = router;