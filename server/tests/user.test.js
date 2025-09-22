const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('User API', () => {
  let authToken;
  let userId;

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

    // Создаем тестового пользователя
    const user = await User.create({
      name: 'Test',
      surname: 'User',
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });

    userId = user._id;

    // Создаем токен для аутентификации
    authToken = jwt.sign(
      { id: userId },
      'your-super-secret-jwt-key-here',
      { expiresIn: '1h' }
    );
  });


  describe('GET /api/users', () => {
    it('should get list of users', async () => {
      // Создаем дополнительных пользователей
      await User.create({
        name: 'User',
        surname: 'Two',
        username: `user2_${Date.now()}`,
        email: `user2_${Date.now()}@example.com`,
        password: 'password123'
      });

      await User.create({
        name: 'User',
        surname: 'Three',
        username: `user3_${Date.now()}`,
        email: `user3_${Date.now()}@example.com`,
        password: 'password123'
      });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.users).toHaveLength(3);
      expect(response.body.users[0].username).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.message).toContain('Токен');
    });

    it('should support pagination', async () => {
      // Создаем много пользователей для тестирования пагинации
      const users = [];
      for (let i = 0; i < 15; i++) {
        users.push({
          name: `User${i}`,
          surname: 'Test',
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: 'password123'
        });
      }
      await User.insertMany(users);

      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.users).toHaveLength(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toContain('testuser');
      expect(response.body.user.email).toContain('test');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(401);

      expect(response.body.message).toContain('Токен');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toContain('не найден');
    });
  });
});
