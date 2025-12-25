import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { storage } from '@/utils/storage'
export const useTheme = defineStore('theme', () => {
  /* 默认值优先读 localStorage，没有再读系统 */
  const dark = ref(
    storage.get('theme')
      ? storage.get('theme') === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  /* 切换函数 */
  function toggle() {
    dark.value = !dark.value
  }

  /* 状态一变化就写 DOM + 持久化 */
  watchEffect(() => {
    const val = dark.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', val)
    localStorage.setItem('theme', val)
  })

  return { dark, toggle }
})
