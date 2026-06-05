const express = require('express');
const router = express.Router();
const { getAllGroups, createGroup, deleteGroup, joinGroup, updateGroup, removeRecipeFromGroup } = require('../controllers/groupController');

router.get('/', getAllGroups);
router.post('/', createGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/join', joinGroup);
router.put('/:id', updateGroup);
router.delete('/:groupId/recipes/:recipeId', removeRecipeFromGroup);

module.exports = router;