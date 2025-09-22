const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Message API', () => {
  let authToken;
  let userId;
  let user2Id;
  let chatId;

  beforeAll(async () => {
    // Подключаемся к тестовой БД
    await mongoose.connect('mongodb://localhost:27017/chat-app-test');
  });

  afterAll(async () => {
    // Отключаемся от БД
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Очищаем базу данных
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    // Создаем тестовых пользователей
    const user1 = await User.create({
      name: 'Message',
      surname: 'User1',
      username: `msguser1_${Date.now()}`,
      email: `msg1_${Date.now()}@example.com`,
      password: 'password123'
    });

    const user2 = await User.create({
      name: 'Message',
      surname: 'User2',
      username: `msguser2_${Date.now()}`,
      email: `msg2_${Date.now()}@example.com`,
      password: 'password123'
    });

    userId = user1._id;
    user2Id = user2._id;

    // Создаем тестовый чат
    const chat = await Chat.create({
      name: 'Test Chat',
      isGroup: false,
      participants: [userId, user2Id],
      createdBy: userId
    });

    chatId = chat._id;

    // Создаем токен для аутентификации
    authToken = jwt.sign(
      { id: userId },
      'your-super-secret-jwt-key-here',
      { expiresIn: '1h' }
    );
  });


  describe('GET /api/messages/chat/:chatId', () => {
    it('should get chat messages', async () => {
      // Создаем тестовые сообщения
      await Message.create({
        text: 'Hello World',
        sender: userId,
        chat: chatId
      });

      await Message.create({
        text: 'Second message',
        sender: user2Id,
        chat: chatId
      });

      const response = await request(app)
        .get(`/api/messages/chat/${chatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.messages).toHaveLength(2);
      expect(response.body.messages[0].text).toBe('Hello World');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/messages/chat/${chatId}`)
        .expect(401);

      expect(response.body.message).toContain('Токен');
    });

    it('should not get messages if user is not participant', async () => {
      const user3 = await User.create({
        name: 'User',
        surname: 'Three',
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });

      const chat2 = await Chat.create({
        name: 'Private Chat',
        isGroup: false,
        participants: [user2Id, user3._id],
        createdBy: user2Id
      });

      const response = await request(app)
        .get(`/api/messages/chat/${chat2._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toContain('не найден');
    });
  });

  describe('POST /api/messages/chat/:chatId', () => {
    it('should send a message', async () => {
      const messageData = {
        text: 'Test message',
        attachments: []
      };

      const response = await request(app)
        .post(`/api/messages/chat/${chatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message.text).toBe('Test message');
    });

    it('should require authentication', async () => {
      const messageData = {
        text: 'Test message'
      };

      const response = await request(app)
        .post(`/api/messages/chat/${chatId}`)
        .send(messageData)
        .expect(401);

      expect(response.body.message).toContain('Токен');
    });

    it('should not send message if user is not participant', async () => {
      const user3 = await User.create({
        name: 'User',
        surname: 'Three',
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });

      const chat2 = await Chat.create({
        name: 'Private Chat',
        isGroup: false,
        participants: [user2Id, user3._id],
        createdBy: user2Id
      });

      const messageData = {
        text: 'Unauthorized message'
      };

      const response = await request(app)
        .post(`/api/messages/chat/${chat2._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData)
        .expect(404);

      expect(response.body.message).toContain('не найден');
    });

    it('should validate message text', async () => {
      const messageData = {
        text: '', // Пустое сообщение
        attachments: []
      };

      const response = await request(app)
        .post(`/api/messages/chat/${chatId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData)
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('PUT /api/messages/chat/:chatId/read', () => {
    it('should mark messages as read', async () => {
      // Создаем непрочитанное сообщение
      await Message.create({
        text: 'Unread message',
        sender: user2Id,
        chat: chatId,
        isRead: false
      });

      const response = await request(app)
        .put(`/api/messages/chat/${chatId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('прочитанные');
    });
  });
});
