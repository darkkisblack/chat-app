const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateSendMessage } = require('../middlewares/validationMiddleware');
const {
  getChatMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  editMessage
} = require('../controllers/messageController');

// Все роуты требуют аутентификации
router.use(authMiddleware);

// Получить сообщения чата
router.get('/chat/:chatId', getChatMessages);

// Отправить сообщение в чат
router.post('/chat/:chatId', validateSendMessage, sendMessage);

// Отметить сообщения чата как прочитанные
router.put('/chat/:chatId/read', markAsRead);

// Удалить сообщение
router.delete('/:messageId', deleteMessage);

// Редактировать сообщение
router.put('/:messageId', editMessage);

module.exports = router;
