const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

// Получить все чаты пользователя
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({ 
      participants: userId,
      isDeleted: { $ne: true }
    })
    .populate('participants', 'name surname username avatar status lastActivity')
    .populate('lastMessage')
    .populate('createdBy', 'name surname username')
    .sort({ updatedAt: -1 });

    // Преобразуем _id в id для фронтенда
    const formattedChats = chats.map(chat => ({
      id: chat._id,
      name: chat.name,
      isGroup: chat.isGroup,
      participants: chat.participants.map(participant => ({
        id: participant._id,
        name: participant.name,
        surname: participant.surname,
        username: participant.username,
        avatar: participant.avatar,
        status: participant.status,
        lastActivity: participant.lastActivity
      })),
      createdBy: {
        id: chat.createdBy._id,
        name: chat.createdBy.name,
        surname: chat.createdBy.surname,
        username: chat.createdBy.username
      },
      lastMessage: chat.lastMessage ? {
        id: chat.lastMessage._id,
        text: chat.lastMessage.text,
        sender: chat.lastMessage.sender,
        createdAt: chat.lastMessage.createdAt
      } : null,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    res.json({
      success: true,
      chats: formattedChats
    });
  } catch (error) {
    console.error('Get user chats error:', error.message);
    res.status(500).json({ message: 'Ошибка получения чатов' });
  }
};

// Создать новый чат
exports.createChat = async (req, res) => {
  try {
    const { name, isGroup = false, participants } = req.body;
    const userId = req.user._id;

    // Проверяем, что участники существуют
    const existingUsers = await User.find({
      _id: { $in: participants },
      isDeleted: false,
      isActive: true
    });

    if (existingUsers.length !== participants.length) {
      return res.status(400).json({ message: 'Некоторые участники не найдены' });
    }

    // Добавляем создателя к участникам, если его там нет
    const allParticipants = [...new Set([userId, ...participants])];

    // Для личного чата проверяем, что участников ровно 2
    if (!isGroup && allParticipants.length !== 2) {
      return res.status(400).json({ message: 'Личный чат должен содержать ровно 2 участника' });
    }

    // Проверяем, не существует ли уже такой чат
    if (!isGroup) {
      const existingChat = await Chat.findOne({
        participants: { $all: allParticipants },
        isGroup: false,
        isDeleted: { $ne: true }
      });

      if (existingChat) {
        return res.status(400).json({ message: 'Чат с этим пользователем уже существует' });
      }
    }

    const chat = new Chat({
      name: isGroup ? name : null, // Для личных чатов имя не нужно
      isGroup,
      participants: allParticipants,
      createdBy: userId
    });

    await chat.save();

    // Получаем полную информацию о чате
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name surname username avatar status lastActivity')
      .populate('createdBy', 'name surname username');

    res.status(201).json({
      success: true,
      message: 'Чат успешно создан',
      chat: populatedChat
    });
  } catch (error) {
    console.error('Create chat error:', error.message);
    res.status(500).json({ message: 'Ошибка создания чата' });
  }
};

// Получить информацию о конкретном чате
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
      isDeleted: { $ne: true }
    })
    .populate('participants', 'name surname username avatar status lastActivity')
    .populate('lastMessage')
    .populate('createdBy', 'name surname username');

    if (!chat) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get chat by ID error:', error.message);
    res.status(500).json({ message: 'Ошибка получения чата' });
  }
};

// Добавить участника в групповой чат
exports.addParticipant = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId: newParticipantId } = req.body;
    const currentUserId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: currentUserId,
      isGroup: true,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Групповой чат не найден' });
    }

    // Проверяем, что новый участник существует
    const newParticipant = await User.findOne({
      _id: newParticipantId,
      isDeleted: false,
      isActive: true
    });

    if (!newParticipant) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверяем, что участник еще не в чате
    if (chat.participants.includes(newParticipantId)) {
      return res.status(400).json({ message: 'Пользователь уже в чате' });
    }

    chat.participants.push(newParticipantId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name surname username avatar status lastActivity')
      .populate('createdBy', 'name surname username');

    res.json({
      success: true,
      message: 'Участник добавлен в чат',
      chat: updatedChat
    });
  } catch (error) {
    console.error('Add participant error:', error.message);
    res.status(500).json({ message: 'Ошибка добавления участника' });
  }
};

// Удалить участника из группового чата
exports.removeParticipant = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const currentUserId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: currentUserId,
      isGroup: true,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Групповой чат не найден' });
    }

    // Удаляем участника
    chat.participants = chat.participants.filter(id => id.toString() !== userId);
    
    // Если участников осталось меньше 2, удаляем чат
    if (chat.participants.length < 2) {
      chat.isDeleted = true;
    }

    await chat.save();

    res.json({
      success: true,
      message: 'Участник удален из чата'
    });
  } catch (error) {
    console.error('Remove participant error:', error.message);
    res.status(500).json({ message: 'Ошибка удаления участника' });
  }
};

// Обновить информацию о чате (только для групповых)
exports.updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;
    const currentUserId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: currentUserId,
      isGroup: true,
      isDeleted: { $ne: true }
    });

    if (!chat) {
      return res.status(404).json({ message: 'Групповой чат не найден' });
    }

    if (name) {
      chat.name = name;
    }

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name surname username avatar status lastActivity')
      .populate('createdBy', 'name surname username');

    res.json({
      success: true,
      message: 'Чат обновлен',
      chat: updatedChat
    });
  } catch (error) {
    console.error('Update chat error:', error.message);
    res.status(500).json({ message: 'Ошибка обновления чата' });
  }
};
