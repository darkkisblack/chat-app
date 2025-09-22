const request = require('supertest');
const app = require('../server');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

describe('Authentication API', () => {
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
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test',
        surname: 'User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not register user with existing email', async () => {
      // Создаем пользователя
      await User.create({
        name: 'Existing',
        surname: 'User',
        username: 'existing',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 10)
      });

      const userData = {
        name: 'New',
        surname: 'User',
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('уже существует');
    });

    it('should validate required fields', async () => {
      const userData = {
        name: 'Test',
        // Отсутствуют обязательные поля
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Создаем тестового пользователя
      await User.create({
        name: 'Test',
        surname: 'User',
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        login: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should login with username', async () => {
      const loginData = {
        login: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid password', async () => {
      const loginData = {
        login: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain('Неверный');
    });

    it('should not login with non-existent user', async () => {
      const loginData = {
        login: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toContain('Неверный');
    });
  });
});
