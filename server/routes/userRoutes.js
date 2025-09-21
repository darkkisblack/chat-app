const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateProfileUpdate, validateStatusUpdate } = require('../middlewares/validationMiddleware');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateStatus,
  getMe
} = require('../controllers/userController');

// Все роуты требуют аутентификации
router.use(authMiddleware);

// Получить информацию о текущем пользователе
router.get('/me', getMe);

// Получить всех пользователей (поиск)
router.get('/', getUsers);

// Получить конкретного пользователя
router.get('/:userId', getUserById);

// Обновить профиль
router.put('/profile', validateProfileUpdate, updateProfile);

// Обновить статус
router.put('/status', validateStatusUpdate, updateStatus);

module.exports = router;
