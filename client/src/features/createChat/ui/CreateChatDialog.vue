<template>
  <v-dialog
    v-model="isOpen"
    :maxWidth="500"
    persistent
  >
    <v-card>
      <v-card-title>
        {{ isGroup ? 'Создать групповой чат' : 'Начать переписку' }}
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <!-- Переключатель типа чата -->
          <v-radio-group
            v-model="chatType"
            inline
            class="mb-4"
          >
            <v-radio
              label="Личный чат"
              value="private"
            />
            <v-radio
              label="Групповой чат"
              value="group"
            />
          </v-radio-group>

          <!-- Название для группового чата -->
          <v-text-field
            v-if="isGroup"
            v-model="chatName"
            label="Название группы"
            placeholder="Введите название группы"
            required
            :errorMessages="errors.name"
            @input="clearError"
          />

          <!-- Поиск пользователей -->
          <v-autocomplete
            v-model="selectedUsers"
            :items="availableUsers"
            itemTitle="displayName"
            itemValue="id"
            :label="isGroup ? 'Выберите участников' : 'Выберите собеседника'"
            :multiple="isGroup"
            :chips="isGroup"
            :closableChips="isGroup"
            clearable
            :loading="isLoadingUsers"
            :errorMessages="errors.participants"
            @update:modelValue="clearError"
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps">
                <template #prepend>
                  <v-avatar size="32">
                    <v-img
                      v-if="item.raw.avatar"
                      :src="item.raw.avatar"
                      :alt="item.raw.name"
                    />
                    <v-icon v-else>
                      mdi-account
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.displayName }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.username }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <!-- Ошибка -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            closable
            @click:close="clearError"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          :loading="isLoading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ isGroup ? 'Создать группу' : 'Начать чат' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useCreateChat } from '../model/useCreateChat';
import { fetchUsers } from '@/entities/user/api/fetchUsers';
import { useUserStore } from '@/entities/user/model/useUserStore';
import type { User } from '@/entities/user/model/useUserStore';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'chatCreated', chat: { id: string }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { isLoading, error, createNewChat, clearError } = useCreateChat();
const userStore = useUserStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const chatType = ref<'private' | 'group'>('private');
const chatName = ref('');
const selectedUsers = ref<string | string[]>([]);
    const availableUsers = ref<Array<User & { displayName: string }>>([]);
    const isLoadingUsers = ref(false);
    const errors = ref({
      name: '',
      participants: '',
    });

    const isGroup = computed(() => chatType.value === 'group');

    const isFormValid = computed(() => {
      if (isGroup.value) {
        return chatName.value.trim() && Array.isArray(selectedUsers.value) && selectedUsers.value.length > 0;
      } else {
        // Для личного чата selectedUsers может быть строкой или массивом с одним элементом
        if (Array.isArray(selectedUsers.value)) {
          return selectedUsers.value.length === 1;
        }
        return selectedUsers.value && selectedUsers.value !== '';
      }
    });

    const loadUsers = async () => {
      isLoadingUsers.value = true;
      try {
        const users = await fetchUsers();
        // Исключаем текущего пользователя
        const currentUserId = userStore.currentUser?.id;
        availableUsers.value = users
          .filter(user => user.id !== currentUserId)
          .map(user => ({
            ...user,
            displayName: `${user.name} ${user.surname || ''}`.trim()
          }));
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        isLoadingUsers.value = false;
      }
    };

const handleSubmit = async () => {
  // Сброс ошибок
  errors.value = { name: '', participants: '' };
  
  // Валидация
  if (isGroup.value && !chatName.value.trim()) {
    errors.value.name = 'Название группы обязательно';
    return;
  }
  
  if (isGroup.value) {
    if (!Array.isArray(selectedUsers.value) || selectedUsers.value.length === 0) {
      errors.value.participants = 'Выберите хотя бы одного участника';
      return;
    }
  } else {
    if (Array.isArray(selectedUsers.value)) {
      if (selectedUsers.value.length === 0) {
        errors.value.participants = 'Выберите собеседника';
        return;
      }
    } else {
      if (!selectedUsers.value || selectedUsers.value === '') {
        errors.value.participants = 'Выберите собеседника';
        return;
      }
    }
  }

  try {
    const participants = isGroup.value 
      ? selectedUsers.value as string[]
      : Array.isArray(selectedUsers.value) 
        ? selectedUsers.value 
        : [selectedUsers.value as string];
      
    const chatData = {
      name: isGroup.value ? chatName.value.trim() : undefined,
      isGroup: isGroup.value,
      participants
    };

    const newChat = await createNewChat(chatData);
    emit('chatCreated', { id: newChat.id });
    closeDialog();
  } catch {
    // Ошибка обрабатывается в useCreateChat
  }
};

const closeDialog = () => {
  isOpen.value = false;
  // Сброс формы
  chatType.value = 'private';
  chatName.value = '';
  selectedUsers.value = [];
  errors.value = { name: '', participants: '' };
  clearError();
};

// Загружаем пользователей при открытии диалога
watch(isOpen, (newValue) => {
  if (newValue) {
    loadUsers();
  }
});

onMounted(() => {
  if (isOpen.value) {
    loadUsers();
  }
});
</script>
