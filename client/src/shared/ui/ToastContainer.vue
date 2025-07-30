<template>
  <div class="toast-container">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-list"
    >
      <v-snackbar
        v-for="toast in toasts"
        :key="toast.id"
        :modelValue="true"
        :color="getToastColor(toast.type)"
        :timeout="toast.timeout"
        location="bottom center"
        persistent
        class="toast-item"
        @update:modelValue="removeToast(toast.id)"
      >
        <div class="d-flex align-center">
          <v-icon
            :icon="getToastIcon(toast.type)"
            class="mr-2"
          />
          {{ toast.message }}
        </div>

        <template #actions>
          <v-btn
            icon
            variant="text"
            @click="removeToast(toast.id)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/shared/lib/useToastStore';
import type { Toast } from '@/shared/lib/useToastStore';

const { toasts, removeToast } = useToastStore();

const getToastColor = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'info';
  }
};

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    default:
      return 'mdi-information';
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

.toast-item {
  pointer-events: auto;
  max-width: 400px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style> 