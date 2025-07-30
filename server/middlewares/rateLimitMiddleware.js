// Middleware для ограничения количества запросов
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток входа
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

module.exports = {
  authLimiter,
  apiLimiter
}; 