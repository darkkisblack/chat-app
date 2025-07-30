# Chat App - Серверная часть

REST API сервер для чат-приложения на Node.js с Express и MongoDB.

## Технологии

- **Node.js** - среда выполнения
- **Express.js** - веб-фреймворк
- **MongoDB** - база данных
- **Mongoose** - ODM для MongoDB
- **Socket.io** - WebSocket для real-time чата
- **JWT** - аутентификация
- **Multer** - загрузка файлов
- **Winston** - логирование

## Установка

```bash
npm install
```

## Настройка

1. Скопируйте `env.example` в `.env`
2. Настройте переменные окружения
3. Убедитесь что MongoDB запущена

## Запуск

```bash
# Разработка
npm start

# Продакшен
NODE_ENV=production npm start
```

## Структура проекта

```
server/
├── config/          # Конфигурации
├── controllers/     # Контроллеры
├── middlewares/     # Middleware
├── models/          # Модели данных
├── routes/          # Маршруты
├── utils/           # Утилиты
├── uploads/         # Загруженные файлы
├── logs/            # Логи
└── server.js        # Точка входа
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/logout` - выход
- `POST /api/auth/refresh` - обновление токена

### Пользователи
- `GET /api/users/profile` - профиль пользователя
- `PUT /api/users/profile` - обновление профиля
- `GET /api/users` - список пользователей

### Сообщения
- `GET /api/messages/:roomId` - сообщения комнаты
- `POST /api/messages` - отправка сообщения
- `PUT /api/messages/:id` - редактирование сообщения
- `DELETE /api/messages/:id` - удаление сообщения

### Комнаты
- `GET /api/rooms` - список комнат
- `POST /api/rooms` - создание комнаты
- `PUT /api/rooms/:id` - обновление комнаты
- `DELETE /api/rooms/:id` - удаление комнаты

### Файлы
- `POST /api/files/upload` - загрузка файла
- `GET /api/files/:id` - получение файла 