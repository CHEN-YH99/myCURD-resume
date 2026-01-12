import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.min.*', '*.d.ts'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx,vue}'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
]
