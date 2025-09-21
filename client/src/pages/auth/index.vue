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
            {{ isLogin ? 'Вход в чат' : 'Регистрация' }}
          </v-card-title>
          
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <!-- Поля для регистрации -->
              <template v-if="!isLogin">
                <v-text-field
                  v-model="name"
                  label="Имя"
                  type="text"
                  required
                  :errorMessages="errors.name"
                  @input="clearError"
                />
                
                <v-text-field
                  v-model="surname"
                  label="Фамилия"
                  type="text"
                  required
                  :errorMessages="errors.surname"
                  @input="clearError"
                />
                
                <v-text-field
                  v-model="username"
                  label="Username"
                  type="text"
                  required
                  :errorMessages="errors.username"
                  @input="clearError"
                />
                
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  required
                  :errorMessages="errors.email"
                  @input="clearError"
                />
              </template>
              
              <!-- Поля для входа -->
              <v-text-field
                v-model="loginValue"
                label="Логин или Email"
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
                {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
              </v-btn>
              
              <v-btn
                variant="text"
                color="primary"
                block
                class="mt-2"
                @click="toggleMode"
              >
                {{ isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти' }}
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
import { useAuth } from '@/features/auth/model/useAuth';

const { login, register, isLoading, error, clearError } = useAuth();

const isLogin = ref(true);
const loginValue = ref('');
const password = ref('');
const name = ref('');
const surname = ref('');
const username = ref('');
const email = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const errors = ref({
  login: '',
  password: '',
  name: '',
  surname: '',
  username: '',
  email: '',
});

const generalError = computed(() => error.value);

const isFormValid = computed(() => {
  if (isLogin.value) {
    return loginValue.value.trim() && password.value.trim();
  } else {
    return name.value.trim() && surname.value.trim() && 
           username.value.trim() && email.value.trim() && 
           password.value.trim();
  }
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  clearError();
  // Очищаем поля
  loginValue.value = '';
  password.value = '';
  name.value = '';
  surname.value = '';
  username.value = '';
  email.value = '';
  errors.value = {
    login: '',
    password: '',
    name: '',
    surname: '',
    username: '',
    email: '',
  };
};

const handleSubmit = async () => {
  // Сброс ошибок
  errors.value = {
    login: '',
    password: '',
    name: '',
    surname: '',
    username: '',
    email: '',
  };
  
  // Валидация
  if (isLogin.value) {
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
    } catch {
      // Ошибка обрабатывается в useAuth
    }
  } else {
    if (!name.value.trim()) {
      errors.value.name = 'Обязательное поле';
      return;
    }
    
    if (!surname.value.trim()) {
      errors.value.surname = 'Обязательное поле';
      return;
    }
    
    if (!username.value.trim()) {
      errors.value.username = 'Обязательное поле';
      return;
    }
    
    if (!email.value.trim()) {
      errors.value.email = 'Обязательное поле';
      return;
    }
    
    if (!password.value.trim()) {
      errors.value.password = 'Обязательное поле';
      return;
    }
    
    try {
      await register(name.value, surname.value, username.value, email.value, password.value);
    } catch {
      // Ошибка обрабатывается в useAuth
    }
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