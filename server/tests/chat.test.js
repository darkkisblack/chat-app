const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Chat API', () => {
  let authToken;
  let userId;
  let user2Id;

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

    // Создаем тестовых пользователей
    const user1 = await User.create({
      name: 'Chat',
      surname: 'User1',
      username: `chatuser1_${Date.now()}`,
      email: `chat1_${Date.now()}@example.com`,
      password: 'password123'
    });

    const user2 = await User.create({
      name: 'Chat',
      surname: 'User2',
      username: `chatuser2_${Date.now()}`,
      email: `chat2_${Date.now()}@example.com`,
      password: 'password123'
    });

    userId = user1._id;
    user2Id = user2._id;

    // Создаем токен для аутентификации
    authToken = jwt.sign(
      { id: userId },
      'your-super-secret-jwt-key-here',
      { expiresIn: '1h' }
    );
  });


  describe('GET /api/chats', () => {
    it('should get user chats', async () => {
      // Создаем тестовый чат
      await Chat.create({
        name: 'Test Chat',
        isGroup: false,
        participants: [userId, user2Id],
        createdBy: userId
      });

      const response = await request(app)
        .get('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.chats).toHaveLength(1);
      expect(response.body.chats[0].name).toBe('Test Chat');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/chats')
        .expect(401);

      expect(response.body.message).toContain('Токен');
    });
  });

  describe('POST /api/chats', () => {
    it('should create a private chat', async () => {
      const chatData = {
        name: 'Private Chat',
        isGroup: false,
        participants: [user2Id]
      };

      const response = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('успешно создан');
    });

    it('should create a group chat', async () => {
      const chatData = {
        name: 'Group Chat',
        isGroup: true,
        participants: [user2Id]
      };

      const response = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should not create chat with invalid participants', async () => {
      const chatData = {
        name: 'Invalid Chat',
        isGroup: false,
        participants: ['invalid-id']
      };

      const response = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });

    it('should not create private chat with more than 2 participants', async () => {
      const user3 = await User.create({
        name: 'User',
        surname: 'Three',
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });

      const chatData = {
        name: 'Invalid Private Chat',
        isGroup: false,
        participants: [user2Id, user3._id]
      };

      const response = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatData)
        .expect(400);

      expect(response.body.message).toContain('ровно 2 участника');
    });
  });

  describe('GET /api/chats/:id', () => {
    it('should get chat by id', async () => {
      const chat = await Chat.create({
        name: 'Test Chat',
        isGroup: false,
        participants: [userId, user2Id],
        createdBy: userId
      });

      const response = await request(app)
        .get(`/api/chats/${chat._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.chat.name).toBe('Test Chat');
    });

    it('should not get chat if user is not participant', async () => {
      const user3 = await User.create({
        name: 'User',
        surname: 'Three',
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      });

      const chat = await Chat.create({
        name: 'Private Chat',
        isGroup: false,
        participants: [user2Id, user3._id],
        createdBy: user2Id
      });

      const response = await request(app)
        .get(`/api/chats/${chat._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toContain('не найден');
    });
  });
});
