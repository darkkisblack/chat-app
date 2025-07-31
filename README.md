# Chat App

Веб-приложение для обмена сообщениями в реальном времени.

## Технологии

### Frontend
- Vue 3 + TypeScript
- Vuetify 3 (Material Design)
- Pinia (управление состоянием)
- Vue Router
- Socket.io-client (WebSocket)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (WebSocket сервер)
- JWT (аутентификация)
- Multer (загрузка файлов)

## Архитектура

### Frontend: Feature-Sliced Design (FSD)
```
src/
├── app/          # Конфигурация приложения
├── pages/        # Страницы
├── widgets/      # Составные блоки UI
├── features/     # Функциональность
├── entities/     # Бизнес-сущности (MVVM)
└── shared/       # Переиспользуемые элементы
```

### Backend: MVC
```
server/
├── controllers/  # Контроллеры
├── models/       # Модели данных
├── routes/       # API маршруты
├── middlewares/  # Промежуточное ПО
└── utils/        # Утилиты
```

## Установка

### Требования
- Node.js 18+
- MongoDB
- npm

### Backend
```bash
cd server
npm install
cp env.example .env
# Настрой .env
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Переменные окружения

Создай `.env` в папке `server`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## API

### Аутентификация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/logout` - выход

### Пользователи
- `GET /api/users` - список пользователей
- `GET /api/users/:id` - профиль

### Сообщения
- `GET /api/messages/:chatId` - сообщения чата
- `POST /api/messages` - отправить сообщение

### Чаты
- `GET /api/chats` - список чатов
- `POST /api/chats` - создать чат

## Тестирование

```bash
# Frontend
cd client && npm run test

# Backend
cd server && npm test
```

## Документация

- `client/docs/` - frontend документация
- `server/docs/` - backend документация

## Разработка

1. Fork репозитория
2. Создай feature branch
3. Commit изменения
4. Push в branch
5. Создай Pull Request