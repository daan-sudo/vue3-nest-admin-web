import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 白名单：不需要登录就能访问的页面
const whiteList = ['/login', '/404', '/register']
declare module 'vue-router' {
  interface RouteMeta {
    title: string // 菜单/Tab/面包屑显示的名称
    icon?: string // 图标
    keepAlive?: boolean // 是否开启缓存
    // hideInMenu?: boolean //是否隐藏菜单

    // // hidden?: boolean // 是否在菜单中隐藏
    affix?: boolean // 是否固定在 Tab 栏 (不可关闭)
  }
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // name: 'login',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/Login.vue'),
    },

    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/views/Menu/MainLayout.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          meta: { title: '首页', keepAlive: true }, // 必须有 title
          component: () => import('@/views/Menu/Home.vue'),
        },
        {
          path: '/system/user',
          name: 'system-user',
          meta: { title: '用户管理', keepAlive: true }, // 必须有 title
          component: () => import('@/views/System/UserSystem.vue'),
        },
        {
          path: '/system/menu',
          name: 'system-menu',
          meta: { title: '菜单管理', keepAlive: true }, // 必须有 title
          component: () => import('@/views/System/MenuSystem.vue'),
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // const router = useRouter()
  // 1. 判断是否有 Token (推荐用 Token 判断，比 userInfo 更可靠)
  const hasToken = userStore.getAccessToken

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，还想去登录页，直接拉回首页
      next({ path: '/' })
    } else {
      // 已登录，正常跳转
      next()
    }
  } else {
    // 2. 未登录的情况
    if (whiteList.includes(to.path)) {
      // 在白名单里，直接放行
      next()
    } else {
      // 不在白名单，强行拦截到登录页
      // 可以带上 redirect 参数，方便登录后跳回原页面
      next(`/login`)
    }
  }
})
export default router
