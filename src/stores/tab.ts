// src/store/tab.ts
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import type { RouteLocationNormalized, LocationQueryValue } from 'vue-router'

// 定义自定义的 Tab 路由类型
interface TabRoute {
  path: string
  fullPath: string
  name: string
  meta: Record<string, unknown>
  query?: Record<string, LocationQueryValue | LocationQueryValue[]> // 修复：使用 Vue Router 的查询参数类型
  hash?: string
  params?: Record<string, string | string[]>
}

interface TabState {
  tabs: TabRoute[]
  cacheList: string[] // 用于 KeepAlive 的组件名列表
  isRouterAlive: boolean // 控制 router-view 的显示隐藏
}

export const useTabStore = defineStore('tab', {
  state: (): TabState => ({
    tabs: [],
    cacheList: [],
    isRouterAlive: true, // 控制 router-view 的显示隐藏
  }),
  actions: {
    async refreshCurrentPage(routeName: string) {
      // 1. 如果当前页面在缓存列表中，先临时移除它
      const index = this.cacheList.indexOf(routeName)
      const isCached = index > -1
      if (isCached) {
        this.cacheList.splice(index, 1)
      }

      // 2. 修改状态，触发 router-view 的显示隐藏
      this.isRouterAlive = false

      // 3. 等待 DOM 彻底销毁后，在下一个时钟周期重新创建
      await nextTick()
      this.isRouterAlive = true

      // 4. 如果该页面原本是需要缓存的，重新放回缓存列表
      if (isCached) {
        // 延迟一会放回，确保组件重新挂载时不是从缓存读取
        nextTick(() => {
          if (!this.cacheList.includes(routeName)) {
            this.cacheList.push(routeName)
          }
        })
      }
    },
    // 添加 Tab
    addTab(route: RouteLocationNormalized) {
      // 1. 拦截不需要显示在 Tab 的路由
      if (route.meta?.hideInMenu || !route.name) return

      // 2. 检查是否已存在（根据路径判断）
      const hasExist = this.tabs.some((tab) => tab.path === route.path)

      if (!hasExist) {
        // 【修复】：存储自定义的 TabRoute 对象，类型已匹配
        this.tabs.push({
          path: route.path,
          fullPath: route.fullPath,
          name: route.name as string,
          meta: { ...route.meta }, // 浅拷贝 meta
          query: { ...route.query },
          hash: route.hash,
          params: { ...route.params },
        })

        console.log('添加成功，当前所有 Tabs:', JSON.parse(JSON.stringify(this.tabs)))
      }

      // 3. 处理 KeepAlive 缓存逻辑
      if (route.meta?.keepAlive && typeof route.name === 'string') {
        if (!this.cacheList.includes(route.name)) {
          this.cacheList.push(route.name)
        }
      }
    },
    // 关闭 Tab
    closeTab(path: string) {
      const index = this.tabs.findIndex((tab) => tab.path === path)
      if (index > -1) {
        const route = this.tabs[index]
        this.tabs.splice(index, 1)
        this.cacheList = this.cacheList.filter((name) => name !== route!.name)
      }
    },
    // 关闭所有tab
    closeAllTabs() {
      this.tabs = []
      this.cacheList = []
    },
  },
  persist: {
    key: 'my-app-tabs', // 存储在 localStorage 里的 key
    storage: localStorage,
    pick: ['tabs'], // 使用 pick 替代 paths
  },
})
