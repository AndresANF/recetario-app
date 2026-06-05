const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id_usuario !== parseInt(req.params.id)) {
        return res.status(400).json({ error: 'El email ya está registrado por otro usuario' });
      }
    }
    // 1. Preparamos los datos seguros (sin la contraseña al principio)
    const dataToUpdate = { name, email };
    
    // 2. Solo agregamos la contraseña si el usuario envió una nueva
    if (password && password.trim() !== "") {
      dataToUpdate.password = password;
    }

    const user = await prisma.user.update({
      where: { id_usuario: parseInt(req.params.id) },
      data: dataToUpdate
    });
    
    res.json(user);
  } catch (error) {
    console.error("Error en updateUser:", error); // <-- Esto te avisará en la terminal si falla
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    // 1. Borramos todo el rastro del usuario primero (Cascada)
    await prisma.recipe.deleteMany({ where: { userId: userId } });
    await prisma.group.deleteMany({ where: { userId: userId } });
    
    // 2. Borramos la cuenta
    await prisma.user.delete({ where: { id_usuario: userId } });
    
    res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error("Error en deleteUser:", error); // <-- Para ver qué falla en la BD
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};

module.exports = { updateUser, deleteUser };