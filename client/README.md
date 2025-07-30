# Chat App - Клиентская часть

Современное чат-приложение на Vue 3 с TypeScript и Vuetify 3.

## Технологии

- **Vue 3** - Composition API
- **TypeScript** - типизированный код
- **Vuetify 3** - Material Design UI
- **Pinia** - управление состоянием
- **Vue Router** - маршрутизация
- **Vite** - сборка и разработка

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

## Сборка

```bash
# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка типов TypeScript
npm run type-check
```

## Линтинг и форматирование

```bash
# Проверка и исправление JS/TS/Vue кода
npm run lint

# Проверка и исправление CSS стилей
npm run lint:style

# Проверка всего кода
npm run lint:all

# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check
```

## Тестирование

```bash
npm run test:unit
```

## Структура проекта

```
src/
├── app/             # Конфигурация приложения
│   ├── config/      # Настройки
│   ├── plugins/     # Плагины (Vuetify)
│   ├── providers/   # Провайдеры
│   ├── styles/      # Глобальные стили
│   ├── App.vue      # Корневой компонент
│   └── main.ts      # Точка входа
├── pages/           # Страницы приложения
├── widgets/         # Виджеты (большие компоненты)
├── features/        # Функциональные модули
├── entities/        # Бизнес-сущности
└── shared/          # Переиспользуемый код
    ├── api/         # API клиенты
    ├── config/      # Общие настройки
    ├── lib/         # Утилиты и хелперы
    └── ui/          # UI компоненты
```
