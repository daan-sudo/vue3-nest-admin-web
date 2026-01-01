<template>
  <a-layout class="h-screen overflow-hidden">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="bg-white shadow-lg"
      v-if="!isContentMax"
    >
      <div class="h-16 flex items-center justify-center gap-2">
        <img src="@/assets/logo.svg" class="w-8 h-8" />
        <span v-if="!collapsed" class="text-xl font-bold text-[#00b96b]">Vue3 Admin</span>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        class="border-none"
        @click="handleMenuClick"
      >
        <template v-for="item in menuData" :key="item.path">
          <a-sub-menu v-if="item.children" :key="item.path">
            <template #title>
              <span>
                <component :is="item.icon" />
                <span>{{ item.name }}</span>
              </span>
            </template>
            <a-menu-item v-for="sub in item.children" :key="sub.path">
              <component :is="sub.icon" />
              <span>{{ sub.name }}</span>
              <!-- {{ sub.name }} -->
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.path">
            <component :is="item.icon" />
            <span>{{ item.name }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        v-if="!isContentMax"
        class="!bg-app-bg !p-7 flex items-center justify-between shadow-sm px-4 border-b-2 border-b-[#daddda]"
      >
        <div class="flex items-center gap-4">
          <menu-unfold-outlined
            v-if="collapsed"
            class="text-lg cursor-pointer"
            @click="collapsed = !collapsed"
          />
          <menu-fold-outlined
            v-else
            class="text-lg cursor-pointer"
            @click="collapsed = !collapsed"
          />

          <a-breadcrumb>
            <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              <span class="flex items-center gap-1 text-primary-text">
                <component :is="item.meta.icon" v-if="item.meta.icon" class="text-[12px]" />
                {{ item.meta.title }}
              </span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="flex items-center gap-4">
          <div @click="toggle">
            <a-tooltip :title="isFullscreen ? '退出全屏' : '全屏'">
              <component
                :is="isFullscreen ? FullscreenExitOutlined : FullscreenOutlined"
                class="text-lg cursor-pointer"
            /></a-tooltip>
          </div>
          <ThemeChange />
          <!-- <a-badge :count="6"><notification-outlined class="text-lg" /></a-badge> -->
          <a-dropdown>
            <div class="flex items-center gap-2 cursor-pointer">
              <a-avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <span class="font-medium text-primary-text">清风大管家</span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>个人中心</a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <div class="bg-[#f0f2f5] !bg-app-bg px-4 pt-2 flex justify-between">
        <a-tabs
          v-model:activeKey="activeTabPath"
          type="editable-card"
          hide-add
          class="custom-tabs !bg-app-bg"
          @change="handleTabChange"
          @edit="onTabEdit"
        >
          <a-tab-pane
            v-for="tab in tabStore.tabs"
            :key="tab.path"
            :tab="tab.meta.title"
            :closable="!tab.meta.affix"
          />
        </a-tabs>
        <div class="w-20 flex items-center justify-center text-lg cursor-pointer gap-3">
          <RedoOutlined @click="refresh" :spin="isSpin" />
          <a-tooltip :title="isContentMax ? '还原' : '内容放大'">
            <component
              @click="toggleContentMax"
              :is="isContentMax ? FullscreenExitOutlined : FullscreenOutlined"
              class="text-lg cursor-pointer"
          /></a-tooltip>
        </div>
      </div>

      <a-layout-content
        :class="['transition-all duration-300', isContentMax ? 'm-0 h-screen' : 'm-4']"
        class="rounded-lg overflow-auto"
      >
        <router-view v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in">
            <keep-alive :include="tabStore.cacheList">
              <component :is="Component" v-if="tabStore.isRouterAlive" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabStore } from '@/stores/tab'
import ThemeChange from '@/components/ThemeChange.vue'
import { useUserStore } from '@/stores/user'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { getMenuListApi } from '@/api/system'

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons-vue'
import { useFullscreen } from '@vueuse/core'
import type { Menu } from '../System/types'
const { isFullscreen, toggle } = useFullscreen()
const userStore = useUserStore()
const isContentMax = ref(false)
const collapsed = ref(false)
const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()

const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>(['/system'])
const activeTabPath = ref(route.path)
const isSpin = ref(false)

const menuData = ref<Menu[]>([])
// 模拟菜单数据
// const menuData = [
//   { title: '首页', path: '/home', icon: 'MonitorOutlined' },
//   {
//     title: '系统管理',
//     path: '/system',
//     icon: 'SettingOutlined',
//     children: [
//       { title: '用户管理', path: '/system/user' },
//       { title: '菜单管理', path: '/system/menu' },
//     ],
//   },
// ]

// 监听路由变化：添加 Tab, 更新面包屑
watch(
  () => route.path,
  () => {
    console.log(route, 'route')
    tabStore.addTab(route)
    activeTabPath.value = route.path
    selectedKeys.value = [route.path]
  },
  { immediate: true },
)

// 面包屑计算
const breadcrumbs = computed(() => route.matched.filter((item) => item.meta.title))

// 点击菜单
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

// 点击 Tab
const handleTabChange = (key: string) => {
  router.push(key)
}

// 关闭 Tab
const onTabEdit = (targetKey: string) => {
  tabStore.closeTab(targetKey)
  if (activeTabPath.value === targetKey) {
    const lastTab = tabStore.tabs[tabStore.tabs.length - 1]
    router.push(lastTab ? lastTab.path : '/home')
  }
}
const toggleContentMax = () => {
  isContentMax.value = !isContentMax.value
}
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isContentMax.value) {
    isContentMax.value = false
  }
}
const refresh = () => {
  isSpin.value = true
  tabStore.refreshCurrentPage(route.path)
  setTimeout(() => {
    isSpin.value = false
  }, 500)
}
// 退出登录
const logout = () => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确认退出登录吗',
    okText: '确认',
    // okType: 'danger',
    cancelText: '取消',
    onOk() {
      userStore.clearAuth()
      tabStore.closeAllTabs()
      router.push('/login')
    },
    onCancel() {
      console.log('Cancel')
    },
    class: 'test',
  })
}
// 获取菜单
async function getMenuList() {
  const res = await getMenuListApi()
  console.log(res)
  menuData.value = res
}
getMenuList()
onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<style lang="scss" scoped>
:deep(.ant-layout-sider) {
  background-color: var(--c-bg) !important;
}
// style.scss 或 MainLayout.vue
:deep(.ant-layout-sider) {
  // background: #001529; // 变成暗色
  .ant-menu {
    // background: transparent;
    // color: rgba(255, 255, 255, 0.65);
  }
  .ant-menu-item-selected {
    background-color: #00b96b !important; // 变成你想要的绿色
    color: white !important;
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
/* 确保切换时平滑 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
