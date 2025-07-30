<template>
  <v-container
    fluid
    class="auth-page d-flex justify-center align-center"
  >
    <v-row
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="auth-card">
          <v-card-title class="text-center text-h4 mb-4">
            Вход в чат
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="loginValue"
                label="Логин"
                type="text"
                required
                :errorMessages="errors.login"
                @input="clearError"
              />
              
              <v-text-field
                v-model="password"
                label="Пароль"
                :type="showPassword ? 'text' : 'password'"
                required
                :minlength="8"
                :errorMessages="errors.password"
                :appendInnerIcon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:appendInner="showPassword = !showPassword"
                @input="clearError"
              />

              <v-checkbox
                v-model="rememberMe"
                label="Запомнить меня"
              />
              
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="isLoading"
                :disabled="!isFormValid"
                class="mt-4"
              >
                Войти
              </v-btn>
            </v-form>
            
            <div
              v-if="generalError"
              class="text-error text-center mt-4"
            >
              {{ generalError }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/features/auth/model/useAuth';
const router = useRouter();
const { login, isLoading, error, clearError } = useAuth();

const loginValue = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const errors = ref({
  login: '',
  password: '',
});

const generalError = computed(() => error.value);

const isFormValid = computed(() => 
  loginValue.value.trim() && password.value.trim()
);

const handleLogin = async () => {
  // Сброс ошибок
  errors.value = { login: '', password: '' };
  
  // Валидация
  if (!loginValue.value.trim()) {
    errors.value.login = 'Обязательное поле';
    return;
  }
  
  if (!password.value.trim()) {
    errors.value.password = 'Обязательное поле';
    return;
  }
  
  try {
    await login(loginValue.value, password.value, rememberMe.value);
    // Редирект уже происходит в useAuth
  } catch (err) {
    // Ошибка обрабатывается в useAuth
  }
};
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.auth-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style> 