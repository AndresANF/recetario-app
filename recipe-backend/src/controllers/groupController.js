const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: { select: { name: true } },
        members: { select: { id_usuario: true, name: true } },
        recipes: true
      }
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const createGroup = async (req, res) => {
  const { name, userId } = req.body;
  try {
    const group = await prisma.group.create({
      data: {
        name,
        userId: parseInt(userId)
      }
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; 

  try {
    const groupId = parseInt(id);
    const currentUserId = parseInt(userId);

    const group = await prisma.group.findUnique({
      where: { id_grupo: groupId }
    });

    if (!group) return res.status(404).json({ error: 'No encontrado' });

    await prisma.recipe.deleteMany({
      where: {
        userId: currentUserId,
        groups: { some: { id_grupo: groupId } }
      }
    });

    if (group.userId === currentUserId) {
      await prisma.group.delete({
        where: { id_grupo: groupId }
      });
      return res.json({ message: 'Grupo eliminado' });
    } else {
      await prisma.group.update({
        where: { id_grupo: groupId },
        data: {
          members: {
            disconnect: { id_usuario: currentUserId }
          }
        }
      });
      return res.json({ message: 'Saliste del grupo' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const joinGroup = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const group = await prisma.group.update({
      where: { id_grupo: parseInt(id) },
      data: {
        members: {
          connect: { id_usuario: parseInt(userId) }
        }
      }
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error' });
  }
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, userId } = req.body;

  try {
    const group = await prisma.group.findUnique({ where: { id_grupo: parseInt(id) } });
    if (group.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Solo el creador puede editar este grupo' });
    }

    const updatedGroup = await prisma.group.update({
      where: { id_grupo: parseInt(id) },
      data: { name }
    });
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar grupo' });
  }
};

const removeRecipeFromGroup = async (req, res) => {
  const { groupId, recipeId } = req.params;
  const { userId } = req.body;

  try {
    const group = await prisma.group.findUnique({ where: { id_grupo: parseInt(groupId) } });
    if (group.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Solo el creador puede quitar recetas' });
    }

    await prisma.group.update({
      where: { id_grupo: parseInt(groupId) },
      data: {
        recipes: { disconnect: { id_receta: parseInt(recipeId) } } 
      }
    });
    res.json({ message: 'Receta removida del grupo' });
  } catch (error) {
    res.status(500).json({ error: 'Error al remover receta' });
  }
};

module.exports = { getAllGroups, createGroup, deleteGroup, joinGroup, updateGroup, removeRecipeFromGroup };