const User = require('../models/userModel');

// Получить всех пользователей (для поиска)
exports.getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    let query = {
      _id: { $ne: userId }, // Исключаем текущего пользователя
      isDeleted: false,
      isActive: true
    };

    // Поиск по имени, фамилии или username
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('name surname username avatar status lastActivity')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Преобразуем _id в id для фронтенда
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      surname: user.surname,
      username: user.username,
      avatar: user.avatar,
      status: user.status,
      lastActivity: user.lastActivity
    }));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Ошибка получения пользователей' });
  }
};

// Получить информацию о конкретном пользователе
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      isDeleted: false,
      isActive: true
    }).select('name surname username avatar status lastActivity createdAt');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
        lastActivity: user.lastActivity,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error.message);
    res.status(500).json({ message: 'Ошибка получения пользователя' });
  }
};

// Обновить профиль пользователя
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, surname, username, avatar } = req.body;

    // Проверяем, что username уникален (если изменился)
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким username уже существует' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (username) updateData.username = username;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('name surname username avatar status lastActivity');

    res.json({
      success: true,
      message: 'Профиль обновлен',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Ошибка обновления профиля' });
  }
};

// Обновить статус пользователя
exports.updateStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.body;

    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        status,
        lastActivity: new Date()
      },
      { new: true }
    ).select('name surname username avatar status lastActivity');

    res.json({
      success: true,
      message: 'Статус обновлен',
      user
    });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ message: 'Ошибка обновления статуса' });
  }
};

// Получить информацию о текущем пользователе
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        lastActivity: user.lastActivity,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({ message: 'Ошибка получения профиля' });
  }
};
