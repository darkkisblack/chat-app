import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timeout?: number;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  const showToast = (
    message: string,
    type: Toast['type'] = 'info',
    timeout: number = 4000
  ) => {
    const id = Date.now().toString();
    const toast: Toast = {
      id,
      message,
      type,
      timeout,
    };

    toasts.value.push(toast);

    // Автоматически удаляем тост
    setTimeout(() => {
      removeToast(id);
    }, timeout);
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const showSuccess = (message: string, timeout?: number) => {
    showToast(message, 'success', timeout);
  };

  const showError = (message: string, timeout?: number) => {
    showToast(message, 'error', timeout);
  };

  const showWarning = (message: string, timeout?: number) => {
    showToast(message, 'warning', timeout);
  };

  const showInfo = (message: string, timeout?: number) => {
    showToast(message, 'info', timeout);
  };

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };
});
