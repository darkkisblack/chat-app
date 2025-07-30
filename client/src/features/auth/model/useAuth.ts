import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@/entities/user/model/useUserStore';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useToastStore } from '@/shared/lib/useToastStore';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/shared/lib/constants';

interface LoginData {
  login: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const useAuth = () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const router = useRouter();
  const userStore = useUserStore();
  const { showError } = useToastStore();

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (
    loginValue: string,
    password: string,
    rememberMe = false
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Моковая авторизация для демонстрации
      if (loginValue === 'demo' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'Демо Пользователь',
          email: 'demo@example.com',
          avatar: 'https://via.placeholder.com/150',
          status: 'online',
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        // Сохраняем токен
        token.value = mockToken;
        user.value = mockUser;

        // Обновляем userStore
        userStore.setCurrentUser(mockUser);
        userStore.addUser(mockUser);

        if (rememberMe) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
          localStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(mockUser)
          );
        } else {
          sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
          sessionStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(mockUser)
          );
        }

        // Редирект на чаты
        console.log('Авторизация успешна, редирект на /');
        await router.push('/');
      } else {
        throw new Error('Неверный логин или пароль');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      error.value = errorMessage;

      // Показываем тостер для ошибок сервера
      if (errorMessage.includes('сервер') || errorMessage.includes('сеть')) {
        showError('Сервер недоступен. Попробуйте еще раз.');
      } else {
        showError(errorMessage);
      }

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Очищаем данные
      token.value = null;
      user.value = null;
      userStore.setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);

      await router.push('/auth');
    }
  };

  const initAuth = () => {
    // Проверяем сохраненный токен при загрузке
    const savedToken =
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedUser =
      localStorage.getItem(STORAGE_KEYS.USER_DATA) ||
      sessionStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser);
      token.value = savedToken;
      user.value = userData;

      // Синхронизируем с userStore
      userStore.setCurrentUser(userData);
      userStore.addUser(userData);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    initAuth,
    clearError,
  };
};
