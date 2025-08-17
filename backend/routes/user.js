const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/me', protect, userController.getUserProfile);
router.get('/notifications', protect, userController.getNotifications);
router.get('/stats', protect, userController.getUserStats);
router.get('/history', protect, userController.getGameHistory);
router.put('/update-username', protect, userController.updateUsername);

module.exports = router;
