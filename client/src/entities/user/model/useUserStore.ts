import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  username?: string;
  avatar?: string;
  status: string;
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);

  const isAuthenticated = computed(() => !!currentUser.value);
  const onlineUsers = computed(() =>
    users.value.filter(user => user.status === 'online')
  );

  const setCurrentUser = (user: User | null) => {
    currentUser.value = user;
  };

  const addUser = (user: User) => {
    const existingIndex = users.value.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users.value[existingIndex] = user;
    } else {
      users.value.push(user);
    }
  };

  const updateUserStatus = (userId: string, status: string) => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
  };

  return {
    currentUser,
    users,
    isAuthenticated,
    onlineUsers,
    setCurrentUser,
    addUser,
    updateUserStatus,
  };
});
