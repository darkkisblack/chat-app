import '@/app/styles/assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from '@/app/plugins/vuetify';

import App from '@/app/App.vue';
import router from '@/app/config/router';
import { useAuth } from '@/features/auth/model/useAuth';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

const { initAuth } = useAuth();

// Инициализируем аутентификацию перед монтированием
initAuth();
app.mount('#app');
