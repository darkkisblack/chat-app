const mongoose = require('mongoose')

const { Schema } = mongoose

const chatSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null
    },
    lastMessageAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Индексы для ускорения выборки чатов пользователя и сортировки по активности
chatSchema.index({ participants: 1 })
chatSchema.index({ updatedAt: -1 })

// Ограничение: минимум 2 участника для чата
chatSchema.path('participants').validate(function (value) {
  return Array.isArray(value) && value.length >= 2
}, 'Chat must include at least two participants')

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema)


