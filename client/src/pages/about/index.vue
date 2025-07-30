<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <v-card>
          <v-card-title class="text-h3 text-center mb-4">
            О приложении
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">
              Современное чат-приложение, созданное с использованием Vue 3 и
              TypeScript.
            </p>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">
                    mdi-vuejs
                  </v-icon>
                </template>
                <v-list-item-title>Vue 3</v-list-item-title>
                <v-list-item-subtitle>Composition API</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">
                    mdi-language-typescript
                  </v-icon>
                </template>
                <v-list-item-title>TypeScript</v-list-item-title>
                <v-list-item-subtitle>Типизированный код</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">
                    mdi-material-design
                  </v-icon>
                </template>
                <v-list-item-title>Vuetify 3</v-list-item-title>
                <v-list-item-subtitle>Material Design UI</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// About view component
</script>
