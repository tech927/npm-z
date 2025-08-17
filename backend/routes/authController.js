const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const asyncHandler = require('express-async-handler');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d\'utilisateur et un mot de passe' });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
  }

  const user = await User.create({ username, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Données utilisateur invalides' });
  }
});

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' });
  }
});

module.exports = { register, login };
