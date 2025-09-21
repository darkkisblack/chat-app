const Joi = require('joi');

// Middleware для валидации входящих данных
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Схемы валидации
const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Имя должно содержать минимум 2 символа',
    'string.max': 'Имя не должно превышать 50 символов',
    'any.required': 'Имя обязательно'
  }),
  surname: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Фамилия должна содержать минимум 2 символа',
    'string.max': 'Фамилия не должна превышать 50 символов',
    'any.required': 'Фамилия обязательна'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username может содержать только буквы и цифры',
    'string.min': 'Username должен содержать минимум 3 символа',
    'string.max': 'Username не должен превышать 30 символов',
    'any.required': 'Username обязателен'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Некорректный email',
    'any.required': 'Email обязателен'
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Пароль должен содержать минимум 6 символов',
    'string.max': 'Пароль не должен превышать 100 символов',
    'any.required': 'Пароль обязателен'
  })
});

const loginSchema = Joi.object({
  login: Joi.string().required().messages({
    'any.required': 'Логин обязателен'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Пароль обязателен'
  })
});

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Имя должно содержать минимум 2 символа',
    'string.max': 'Имя не должно превышать 50 символов'
  }),
  surname: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Фамилия должна содержать минимум 2 символа',
    'string.max': 'Фамилия не должна превышать 50 символов'
  }),
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
    'string.alphanum': 'Username может содержать только буквы и цифры',
    'string.min': 'Username должен содержать минимум 3 символа',
    'string.max': 'Username не должен превышать 30 символов'
  }),
  avatar: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Некорректная ссылка на аватар'
  })
});

const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('online', 'offline', 'away').required().messages({
    'any.only': 'Статус должен быть: online, offline или away',
    'any.required': 'Статус обязателен'
  })
});

const createChatSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Название чата должно содержать минимум 1 символ',
    'string.max': 'Название чата не должно превышать 100 символов'
  }),
  isGroup: Joi.boolean().default(false),
  participants: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required().messages({
    'array.min': 'Должен быть указан хотя бы один участник',
    'any.required': 'Участники обязательны',
    'string.pattern.base': 'Некорректный ID участника'
  })
});

const sendMessageSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Сообщение не может быть пустым',
    'string.max': 'Сообщение не должно превышать 1000 символов',
    'any.required': 'Текст сообщения обязателен'
  }),
  attachments: Joi.array().items(Joi.string().uri()).optional().default([]).messages({
    'string.uri': 'Некорректная ссылка на вложение'
  })
});

// Готовые валидаторы
const validateRegistration = validateRequest(registrationSchema);
const validateLogin = validateRequest(loginSchema);
const validateProfileUpdate = validateRequest(profileUpdateSchema);
const validateStatusUpdate = validateRequest(statusUpdateSchema);
const validateCreateChat = validateRequest(createChatSchema);
const validateSendMessage = validateRequest(sendMessageSchema);

module.exports = {
  validateRequest,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateStatusUpdate,
  validateCreateChat,
  validateSendMessage
}; 