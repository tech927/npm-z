const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Question = require('../models/Question');
const Score = require('../models/Score');

// Configuration admin
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "inconnu-tech-web";

// Middleware de vérification admin
router.use((req, res, next) => {
  const adminPassword = req.headers['admin-password'] 
    || req.body.adminPassword 
    || req.query.adminPassword;

  if (!adminPassword) {
    return res.status(401).json({ 
      success: false,
      message: 'Mot de passe admin requis' 
    });
  }

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ 
      success: false,
      message: 'Mot de passe admin incorrect' 
    });
  }

  next();
});

/**
 * @route POST /api/admin/send-message
 * @description Envoyer un message global à tous les utilisateurs
 * @access Private/Admin
 */
router.post('/send-message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false,
        message: 'Veuillez fournir un message' 
      });
    }
    
    // Sauvegarde comme message admin
    await Message.create({
      content: message,
      isAdminMessage: true
    });
    
    res.json({ 
      success: true,
      message: 'Message envoyé à tous les utilisateurs' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

/**
 * @route GET /api/admin/stats
 * @description Obtenir les statistiques administratives
 * @access Private/Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const questionsCount = await Question.countDocuments();
    const gamesCount = await Score.countDocuments();
    
    res.json({ 
      success: true,
      stats: { usersCount, questionsCount, gamesCount } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;
