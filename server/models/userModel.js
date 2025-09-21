const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Уникальные индексы (регистронезависимые) и игнор мягко удалённых
userSchema.index(
  { 
    email: 1 
  },
  { 
    unique: true, 
    collation: { 
      locale: 'en', 
      strength: 2 
    }, 
    partialFilterExpression: { 
      isDeleted: { 
        $eq: false 
      } 
    } 
  }
);
userSchema.index(
  { 
    username: 1 
  },
  { 
    unique: true, 
    collation: { 
      locale: 'en', 
      strength: 2 
    }, 
    partialFilterExpression: { 
      isDeleted: { 
        $eq: false 
      } 
    } 
  }
);

// Поиск пользователей по имени/фамилии
userSchema.index(
  { 
    name: 'text', 
    surname: 'text' 
  }, 
  { 
    weights: { 
      name: 3, 
      surname: 2 
    }, 
    name: 'user_text_search' 
  }
);

// Быстрый выбор «кто онлайн сейчас» и сортировка по активности
userSchema.index(
  { 
    status: 1, 
    lastActivity: -1 
  }
);

// Фильтрация по флагам
userSchema.index({ isActive: 1 });
userSchema.index({ isDeleted: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
