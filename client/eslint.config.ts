import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
/* import { parse } from "@typescript-eslint/parser"; */

export default [
  {
    languageOptions: {
      /* parser: parse, */
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // js
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },

  // ts
  ...tseslint.configs.recommended,
  {
    rules: {
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // vue
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      'vue/html-self-closing': 'off',
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/v-on-event-hyphenation': [
        'error',
        'never',
        {
          autofix: false,
          ignore: [],
        },
      ],
      'vue/singleline-html-element-content-newline': [
        'error',
        {
          ignoreWhenNoAttributes: true, // Игнорировать, если нет атрибутов
          ignoreWhenEmpty: true, // Игнорировать пустые элементы
          ignores: ['pre', 'textarea', 'div'], // Исключения для определённых тегов
        },
      ],
    },
  },
];
