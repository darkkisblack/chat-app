import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@/entities/user/model/useUserStore';
import { useUserStore } from '@/entities/user/model/useUserStore';
import { useToastStore } from '@/shared/lib/useToastStore';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/shared/lib/constants';
import { login as loginApi, register as registerApi, type AuthResponse as ApiAuthResponse } from '@/entities/user/api/authApi';
import { socketService } from '@/shared/lib/socket';


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
      const response: ApiAuthResponse = await loginApi({
        login: loginValue,
        password: password
      });

      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
        status: response.user.status as string,
      };

      // Сохраняем токен
      token.value = response.token;
      user.value = userData;

      // Обновляем userStore
      userStore.setCurrentUser(userData);
      userStore.addUser(userData);

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        );
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        sessionStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        );
      }

          // Подключаемся к WebSocket с небольшой задержкой
          setTimeout(() => {
            socketService.connect(response.token);
          }, 100);

      // Редирект на чаты
      await router.push('/');
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
      // Отключаемся от WebSocket
      socketService.disconnect();
      
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

  const initAuth = async () => {
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

      // Подключаемся к WebSocket только если еще не подключены
      if (!socketService.isConnected()) {
        setTimeout(() => {
          socketService.connect(savedToken);
        }, 100);
      }
    }
  };

  const register = async (
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response: ApiAuthResponse = await registerApi({
        name,
        surname,
        username,
        email,
        password
      });

      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
        status: response.user.status as string,
      };

      // Сохраняем токен
      token.value = response.token;
      user.value = userData;

      // Обновляем userStore
      userStore.setCurrentUser(userData);
      userStore.addUser(userData);

      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );

          // Подключаемся к WebSocket с небольшой задержкой
          setTimeout(() => {
            socketService.connect(response.token);
          }, 100);

      // Редирект на чаты
      await router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации';
      error.value = errorMessage;
      showError(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
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
    register,
    logout,
    initAuth,
    clearError,
  };
};
