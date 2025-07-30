<template>
  <v-btn
    :variant="variant"
    :color="color"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template> 

<script setup lang="ts">
interface Props {
  variant?: 'text' | 'outlined' | 'elevated' | 'tonal' | 'flat' | 'plain';
  color?: string;
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  color: 'primary',
  size: 'default',
  disabled: false,
  loading: false,
  type: 'button',
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
