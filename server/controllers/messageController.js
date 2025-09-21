const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// Получить сообщения чата
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Проверяем, что пользователь участник чата
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name surname username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Преобразуем _id в id для фронтенда
    const formattedMessages = messages.reverse().map(message => ({
      id: message._id,
      text: message.text,
      userId: message.sender._id,
      chatId: message.chat,
      timestamp: message.createdAt,
      isRead: message.isRead,
      attachments: message.attachments,
      sender: {
        id: message.sender._id,
        name: message.sender.name,
        surname: message.sender.surname,
        username: message.sender.username,
        avatar: message.sender.avatar
      }
    }));

    res.json({
      success: true,
      messages: formattedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ chat: chatId })
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error.message);
    res.status(500).json({ message: 'Ошибка получения сообщений' });
  }
};

// Отправить сообщение
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text, attachments = [] } = req.body;
    const userId = req.user._id;

    // Проверяем, что пользователь участник чата
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    // Создаем сообщение
    const message = new Message({
      text,
      sender: userId,
      chat: chatId,
      attachments
    });

    await message.save();

    // Обновляем последнее сообщение в чате
    chat.lastMessage = message._id;
    chat.lastMessageAt = message.createdAt;
    await chat.save();

    // Получаем полную информацию о сообщении
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name surname username avatar');

    // Преобразуем _id в id для фронтенда
    const formattedMessage = {
      id: populatedMessage._id,
      text: populatedMessage.text,
      userId: populatedMessage.sender._id,
      chatId: populatedMessage.chat,
      timestamp: populatedMessage.createdAt,
      isRead: populatedMessage.isRead,
      attachments: populatedMessage.attachments,
      sender: {
        id: populatedMessage.sender._id,
        name: populatedMessage.sender.name,
        surname: populatedMessage.sender.surname,
        username: populatedMessage.sender.username,
        avatar: populatedMessage.sender.avatar
      }
    };

    res.status(201).json({
      success: true,
      message: formattedMessage
    });
  } catch (error) {
    console.error('Send message error:', error.message);
    res.status(500).json({ message: 'Ошибка отправки сообщения' });
  }
};

// Отметить сообщения как прочитанные
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Проверяем, что пользователь участник чата
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    // Отмечаем все непрочитанные сообщения как прочитанные
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: userId }, // Не свои сообщения
        isRead: false 
      },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Сообщения отмечены как прочитанные'
    });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    res.status(500).json({ message: 'Ошибка обновления статуса сообщений' });
  }
};

// Удалить сообщение (только свое)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({ message: 'Сообщение не найдено' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Сообщение удалено'
    });
  } catch (error) {
    console.error('Delete message error:', error.message);
    res.status(500).json({ message: 'Ошибка удаления сообщения' });
  }
};

// Редактировать сообщение (только свое)
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({ message: 'Сообщение не найдено' });
    }

    message.text = text;
    message.updatedAt = new Date();
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'name surname username avatar');

    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    console.error('Edit message error:', error.message);
    res.status(500).json({ message: 'Ошибка редактирования сообщения' });
  }
};
