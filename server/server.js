const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const helmet = require('helmet')
const compression = require('compression')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const corsMiddleware = require('./middlewares/corsMiddleware')
const { apiLimiter } = require('./middlewares/rateLimitMiddleware')
const errorHandler = require('./middlewares/errorMiddleware')
const jwt = require('jsonwebtoken')
const User = require('./models/userModel')

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})
const port = process.env.PORT || 3000

// Base middlewares
app.use(helmet())
app.use(compression())
app.use(corsMiddleware)
app.use(express.json())

// Rate limit for API
app.use('/api', apiLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/chats', require('./routes/chatRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))

// Error handler (last)
app.use(errorHandler)

// Socket.IO аутентификация
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || user.isDeleted || !user.isActive) {
      return next(new Error('Authentication error'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO события
io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected`);

  // Присоединяемся к комнатам чатов пользователя
  socket.on('join_chats', async () => {
    const Chat = require('./models/chatModel');
    const userChats = await Chat.find({ 
      participants: socket.userId,
      isDeleted: { $ne: true }
    });
    
    userChats.forEach(chat => {
      socket.join(`chat_${chat._id}`);
    });
  });

  // Присоединяемся к конкретному чату
  socket.on('join_chat', (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  // Покидаем чат
  socket.on('leave_chat', (chatId) => {
    socket.leave(`chat_${chatId}`);
  });

  // Обработка новых сообщений
  socket.on('send_message', async (data) => {
    try {
      const { chatId, text, attachments = [] } = data;
      
      // Проверяем, что пользователь участник чата
      const Chat = require('./models/chatModel');
      const Message = require('./models/messageModel');
      
      const chat = await Chat.findOne({
        _id: chatId,
        participants: socket.userId,
        isDeleted: { $ne: true }
      });

      if (!chat) {
        socket.emit('error', { message: 'Чат не найден' });
        return;
      }

      // Создаем сообщение
      const message = new Message({
        text,
        sender: socket.userId,
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

      // Отправляем сообщение всем участникам чата
      io.to(`chat_${chatId}`).emit('new_message', populatedMessage);
      
    } catch (error) {
      console.error('Socket send message error:', error.message);
      socket.emit('error', { message: 'Ошибка отправки сообщения' });
    }
  });

  // Обработка отключения
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`);
  });
});

// Start
connectDB().then(() => {
  server.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}).catch(() => {
  process.exit(1)
})
