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

## Установка и запуск

### Требования
- Node.js 18+
- MongoDB
- npm

### 1. Установка зависимостей

```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

### 2. Настройка окружения

Создай файл `.env` в папке `server`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### 3. Запуск MongoDB

**Локально:**
```bash
mongod
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Запуск приложения

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

## Первый запуск

1. Открой http://localhost:5173
2. Нажми "Нет аккаунта? Зарегистрироваться"
3. Создай свой аккаунт
4. Войди в систему
5. Создай первый чат с кем-то (если есть другие пользователи)

## Доступ к приложению

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

## API

### Аутентификация
- `POST /api/auth/register` - регистрация (в перспективе)
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
- `GET /api/chats/:id` - получить чат
- `PUT /api/chats/:id` - обновить чат
- `POST /api/chats/:id/participants` - добавить участника
- `DELETE /api/chats/:id/participants/:userId` - удалить участника

## WebSocket события

### Клиент -> Сервер
- `join_chats` - присоединиться к чатам пользователя
- `join_chat` - присоединиться к конкретному чату
- `leave_chat` - покинуть чат
- `send_message` - отправить сообщение

### Сервер -> Клиент
- `new_message` - новое сообщение
- `error` - ошибка

## Troubleshooting

**MongoDB не подключается:**
- Проверь что MongoDB запущен
- Проверь MONGODB_URI в .env

**CORS ошибки:**
- Проверь CORS_ORIGIN в .env
- Убедись что фронт запущен на правильном порту

**WebSocket не работает:**
- Проверь что токен валидный
- Проверь CLIENT_URL в .env сервера

**Очистка БД:**
```bash
# Подключись к MongoDB
mongosh
use chat-app
db.dropDatabase()
```

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
