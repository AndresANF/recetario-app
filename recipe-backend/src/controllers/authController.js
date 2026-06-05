const prisma = require('../config/db');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const user = await prisma.user.create({ data: { name, email, password } });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    // Verificamos si el usuario existe y si la contraseña coincide
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { registerUser, loginUser };