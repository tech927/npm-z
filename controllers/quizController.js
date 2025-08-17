const Question = require('../../models/Question');
const Score = require('../../models/Score');
const User = require('../../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get random questions
// @route   GET /api/quiz/questions
// @access  Private
const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.aggregate([
    { $sample: { size: 10 } },
    { $project: { question: 1, options: 1, correctAnswer: 1 } }
  ]);
  
  res.json(questions);
});

// @desc    Save user score
// @route   POST /api/quiz/save-score
// @access  Private
const saveScore = asyncHandler(async (req, res) => {
  const { score } = req.body;
  
  // Enregistrer le score
  await Score.create({
    user: req.user.id,
    score
  });
  
  // Mettre à jour les points totaux de l'utilisateur
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { points: score, gamesPlayed: 1 }
  });
  
  res.json({ message: 'Score enregistré' });
});

// @desc    Add new question
// @route   POST /api/quiz/add-question
// @access  Private
const addQuestion = asyncHandler(async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  
  if (!question || !options || options.length !== 4 || correctAnswer === undefined) {
    return res.status(400).json({ message: 'Données de question invalides' });
  }
  
  const newQuestion = await Question.create({
    question,
    options,
    correctAnswer,
    createdBy: req.user.id
  });
  
  res.status(201).json(newQuestion);
});

module.exports = { getQuestions, saveScore, addQuestion };
