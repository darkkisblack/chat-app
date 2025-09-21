const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    // Простой вариант: массив строк (URLs/ids вложений)
    attachments: {
      type: [String],
      default: []
    },
    // Упрощённая метка прочтения (для продакшена лучше хранить readBy[])
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Индексы: быстрый выбор по чату и сортировка по дате
messageSchema.index({ chat: 1, createdAt: -1 });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = mongoose.model('Message', messageSchema) || mongoose.model('messages', messageSchema);