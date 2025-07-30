<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <ToastContainer />
  </v-app>
</template>

<script setup lang="ts">
import ToastContainer from '@/shared/ui/ToastContainer.vue';
</script>
