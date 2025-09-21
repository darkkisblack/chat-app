const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateCreateChat } = require('../middlewares/validationMiddleware');
const {
  getUserChats,
  createChat,
  getChatById,
  addParticipant,
  removeParticipant,
  updateChat
} = require('../controllers/chatController');

// Все роуты требуют аутентификации
router.use(authMiddleware);

// Получить все чаты пользователя
router.get('/', getUserChats);

// Создать новый чат
router.post('/', validateCreateChat, createChat);

// Получить конкретный чат
router.get('/:chatId', getChatById);

// Обновить чат (только групповые)
router.put('/:chatId', updateChat);

// Добавить участника в групповой чат
router.post('/:chatId/participants', addParticipant);

// Удалить участника из группового чата
router.delete('/:chatId/participants/:userId', removeParticipant);

module.exports = router;
