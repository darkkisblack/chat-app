<template>
  <component
    :is="variant.startsWith('h') ? variant : 'span'"
    class="text-component"
    :class="[
      `text-${props.variant}`,
      `text-${props.align}`,
      `font-weight-${props.weight}`,
    ]"
    :style="{ color: props.color }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'bold';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body1',
  color: 'inherit',
  align: 'left',
  weight: 'normal',
});
</script>

<style scoped>
.text-component {
  display: block;
  margin: 0;
  padding: 0;
}

.text-h1 {
  font-size: 2.5rem;
  line-height: 1.2;
}

.text-h2 {
  font-size: 2rem;
  line-height: 1.3;
}

.text-h3 {
  font-size: 1.75rem;
  line-height: 1.4;
}

.text-h4 {
  font-size: 1.5rem;
  line-height: 1.4;
}

.text-h5 {
  font-size: 1.25rem;
  line-height: 1.5;
}

.text-h6 {
  font-size: 1rem;
  line-height: 1.5;
}

.text-body1 {
  font-size: 1rem;
  line-height: 1.5;
}

.text-body2 {
  font-size: 0.875rem;
  line-height: 1.5;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.4;
}

.font-weight-normal {
  font-weight: 400;
}

.font-weight-medium {
  font-weight: 500;
}

.font-weight-bold {
  font-weight: 700;
}
</style> 