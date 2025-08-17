const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const protect = require('../middleware/authMiddleware');

router.get('/questions', protect, quizController.getQuestions);
router.post('/save-score', protect, quizController.saveScore);
router.post('/add-question', protect, quizController.addQuestion);

module.exports = router;
