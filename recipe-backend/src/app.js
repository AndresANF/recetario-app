const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/groups', groupRoutes);

module.exports = app;