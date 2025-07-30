import { createRouter, createWebHistory } from 'vue-router';
import ChatPage from '@/pages/chat/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/pages/auth/index.vue'),
    },
    {
      path: '/',
      name: 'chat',
      component: ChatPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/index.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Навигационные хуки
router.beforeEach((to, from, next) => {
  // Проверяем токен напрямую, так как useAuth может не быть инициализирован
  const savedToken =
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  const isAuthenticated = !!savedToken;

  // Если требуется авторизация и пользователь не авторизован
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
    return;
  }

  // Если авторизованный пользователь пытается зайти на страницу входа
  if (to.path === '/auth' && isAuthenticated) {
    next('/');
    return;
  }

  next();
});

export default router;
