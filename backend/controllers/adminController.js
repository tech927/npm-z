const User = require('../../models/User');
const Question = require('../../models/Question');
const Score = require('../../models/Score');
const Message = require('../../models/Message');
const asyncHandler = require('express-async-handler');

// @desc    Send global message to all users
// @route   POST /api/admin/send-message
// @access  Private/Admin
const sendGlobalMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ message: 'Veuillez fournir un message' });
  }
  
  // Save as admin message
  await Message.create({
    content: message,
    isAdminMessage: true
  });
  
  res.json({ message: 'Message envoyé à tous les utilisateurs' });
});

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const questionsCount = await Question.countDocuments();
  const gamesCount = await Score.countDocuments();
  
  res.json({ usersCount, questionsCount, gamesCount });
});

module.exports = {
  sendGlobalMessage,
  getAdminStats
};
