const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRecipe = async (req, res) => {
  const { title, ingredients, steps, userId, groupIds } = req.body; // Ahora recibe groupIds (array)
  try {
    const recipeData = {
      title,
      ingredients,
      steps,
      userId: parseInt(userId),
    };

    if (groupIds && groupIds.length > 0) {
      recipeData.groups = {
        connect: groupIds.map(id => ({ id_grupo: parseInt(id) }))
      };
    }

    const recipe = await prisma.recipe.create({ data: recipeData, include: { groups: true } });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la receta' });
  }
};

const getRecipes = async (req, res) => {
  const { userId } = req.query;
  try {
    const recipes = await prisma.recipe.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      include: { 
        groups: true,
        user: { select: { name: true } } 
      },
      orderBy: { title: 'asc' } 
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
};

const updateRecipe = async (req, res) => {
  const { title, ingredients, steps, groupIds } = req.body;
  try {
    const dataToUpdate = { title, ingredients, steps };

    if (groupIds !== undefined) {
      dataToUpdate.groups = { 
        set: groupIds.map(id => ({ id_grupo: parseInt(id) })) // Reemplaza los grupos antiguos por los nuevos
      }; 
    }

    const recipe = await prisma.recipe.update({
      where: { id_receta: parseInt(req.params.id) },
      data: dataToUpdate
    });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la receta' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await prisma.recipe.delete({ where: { id_receta: parseInt(req.params.id) } });
    res.json({ message: 'Receta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
};

const removeRecipeFromGroup = async (req, res) => {
  const { groupId } = req.body;
  try {
    const recipe = await prisma.recipe.update({
      where: { id_receta: parseInt(req.params.id) },
      data: { groups: { disconnect: { id_grupo: parseInt(groupId) } } }
    });
    res.json({ message: "Removida del grupo", recipe });
  } catch (error) {
    res.status(500).json({ error: 'Error al remover' });
  }
};

module.exports = { createRecipe, getRecipes, updateRecipe, deleteRecipe, removeRecipeFromGroup };