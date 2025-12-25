<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/theme'
import { theme } from 'ant-design-vue' // 引入 AntD 的主题配置
const store = useTheme()
const { dark: isDark } = storeToRefs(store)
const themeConfig = computed(() => ({
  // 1. 核心：切换算法
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,

  cssVar: true, // 2. 配置 CSS 变量

  // 3. 可选：自定义全局主色
  token: {
    colorPrimary: '#1677ff',
  },
}))
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <!-- <AppProvider> -->
    <RouterView class="bg-layout" />
    <!-- </AppProvider> -->
  </a-config-provider>
</template>

<style scoped></style>
