const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Ищем пользователя по email или username
    let user = await User.findOne({
      $or: [
        { email: login },
        { username: login }
      ],
      isDeleted: false,
      isActive: true
    });

    // Проверяем, существует ли юзер
    if (!user) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Проверка соответствия пароля
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }
    
    // Генерация JWT если все ок
    const payload = {
      id: user._id
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;

        res.json({ 
          success: true,
          token, 
          userId: user._id,
          user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status
          }
        });
      }
    )

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

exports.register = async (req, res) => {
  const { name, surname, username, email, password } = req.body;

  try {
    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Пользователь с таким email уже существует' : 'Пользователь с таким username уже существует'
      });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создаем нового пользователя
    const user = new User({
      name,
      surname,
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Генерируем JWT
    const payload = {
      id: user._id
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          success: true,
          message: 'Пользователь успешно зарегистрирован',
          token,
          userId: user._id,
          user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            status: user.status
          }
        });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}