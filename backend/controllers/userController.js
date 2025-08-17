const User = require('../../models/User');
const Score = require('../../models/Score');
const Message = require('../../models/Message');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/user/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  // Get user rank based on points
  const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;
  
  res.json({
    ...user._doc,
    rank
  });
});

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Message.find({
    $or: [
      { recipient: req.user.id },
      { isAdminMessage: true }
    ]
  }).sort({ createdAt: -1 }).limit(10);
  
  res.json(notifications);
});

// @desc    Get user stats
// @route   GET /api/user/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const scores = await Score.find({ user: req.user.id });
  
  const correctAnswers = scores.reduce((acc, score) => acc + score.score, 0);
  const averageScore = scores.length > 0 ? correctAnswers / scores.length : 0;
  
  const questionsAdded = await Question.countDocuments({ createdBy: req.user.id });
  
  res.json({
    correctAnswers,
    averageScore,
    questionsAdded
  });
});

// @desc    Get user game history
// @route   GET /api/user/history
// @access  Private
const getGameHistory = asyncHandler(async (req, res) => {
  const history = await Score.find({ user: req.user.id })
    .sort({ date: -1 })
    .limit(20);
  
  res.json(history);
});

// @desc    Update username
// @route   PUT /api/user/update-username
// @access  Private
const updateUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d\'utilisateur' });
  }
  
  const userExists = await User.findOne({ username });
  if (userExists && userExists._id.toString() !== req.user.id) {
    return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
  }
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username },
    { new: true }
  ).select('-password');
  
  res.json(user);
});

module.exports = {
  getUserProfile,
  getNotifications,
  getUserStats,
  getGameHistory,
  updateUsername
};
