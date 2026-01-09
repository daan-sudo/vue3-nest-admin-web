<template>
  <div class="p-6 space-y-6 min-h-screen">
    <div class="p-6 rounded-lg shadow-sm flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <a-avatar :size="64" :src="userInfo?.avatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div>
          <h1 class="text-xl font-bold">
            早安，{{ userInfo?.nickName || userInfo?.username }}，开始您一天的工作吧！
          </h1>
          <p class="text-gray-500 mt-1">
            {{ userInfo?.department?.name || '研发部' }} | {{ userInfo?.remark || '系统管理员' }}
          </p>
          <p class="text-gray-500 mt-1 font-bold">
            {{ weatherInfo?.location?.name }},今日天气{{ weatherInfo?.now?.text }},{{
              weatherInfo?.now?.temperature
            }}℃
          </p>
        </div>
      </div>
      <div class="flex space-x-8 text-right">
        <div>
          <div class="text-gray-400 text-sm mb-1">项目数</div>
          <div class="text-2xl font-semibold">12</div>
        </div>
        <div>
          <div class="text-gray-400 text-sm mb-1">待办项</div>
          <div class="text-2xl font-semibold">3 / 10</div>
        </div>
        <div>
          <div class="text-gray-400 text-sm mb-1">团队排名</div>
          <div class="text-2xl font-semibold">4 / 20</div>
        </div>
      </div>
    </div>

    <a-row :gutter="16">
      <a-col :span="6" v-for="(item, index) in stats" :key="index">
        <a-card :bordered="false" class="hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">{{ item.title }}</span>
            <a-tag :color="item.color">{{ item.tag }}</a-tag>
          </div>
          <div class="text-3xl font-bold mt-4 mb-2">{{ item.value }}</div>
          <div class="flex items-center text-xs text-gray-400">
            <span>周同比 {{ item.rise ? '↑' : '↓' }} {{ item.percent }}%</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="访问量趋势" :bordered="false" class="h-full">
          <template #extra><a href="#">查看更多</a></template>
          <div
            class="h-64 w-full rounded flex items-center justify-center border border-dashed border-gray-300 text-gray-400"
          >
            [此处集成 Echarts 或 Chart.js 统计图表]
          </div>
        </a-card>
      </a-col>

      <a-col :span="8">
        <div class="space-y-6">
          <a-card title="快捷导航" :bordered="false">
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="nav in navs"
                :key="nav.name"
                class="flex flex-col items-center p-2 hover:bg-blue-50 cursor-pointer rounded transition-colors"
              >
                <component :is="nav.icon" class="text-xl mb-2" :style="{ color: nav.color }" />
                <span class="text-xs">{{ nav.name }}</span>
              </div>
            </div>
          </a-card>

          <a-card title="系统动态" :bordered="false">
            <a-list item-layout="horizontal" :data-source="activities">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :description="item.time">
                    <template #title>
                      <span class="text-sm"
                        >{{ item.user }} {{ item.action }}
                        <a class="text-blue-500">{{ item.target }}</a></span
                      >
                    </template>
                    <template #avatar>
                      <a-avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
type WeatherInfo = {
  location: { name: string }
  now: { text: string; temperature: string }
}
import {
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  DesktopOutlined,
  RocketOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { get, toString } from 'lodash-es'

// 1. 获取 Pinia 中的用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 2. 模拟统计数据
const stats = [
  { title: '总销售额', value: '￥126,560', tag: '月', color: 'blue', rise: true, percent: 12 },
  { title: '访问量', value: '8,846', tag: '日', color: 'green', rise: true, percent: 5 },
  { title: '支付笔数', value: '6,560', tag: '周', color: 'orange', rise: false, percent: 2 },
  { title: '运营指数', value: '78%', tag: '年', color: 'purple', rise: true, percent: 11 },
]

// 3. 模拟快捷导航
const navs = [
  { name: '用户管理', icon: TeamOutlined, color: '#69c0ff' },
  { name: '分析页', icon: BarChartOutlined, color: '#95de64' },
  { name: '商品管理', icon: ShoppingOutlined, color: '#ff9c6e' },
  { name: '系统设置', icon: SettingOutlined, color: '#b37feb' },
  { name: '工作台', icon: DesktopOutlined, color: '#5cdbd3' },
  { name: '发布', icon: RocketOutlined, color: '#ff85c0' },
]

// 4. 模拟动态
const activities = [
  { user: '曲丽丽', action: '更新了', target: '项目进展', time: '刚刚' },
  { user: '付小小', action: '修改了', target: '系统参数', time: '1小时前' },
  { user: '林东东', action: '部署了', target: '后端服务', time: '昨天 10:20' },
]
const weatherInfo = ref<WeatherInfo>({
  location: { name: '' },
  now: { text: '', temperature: '' },
})
const fetchWeatherInfo = async () => {
  // https://www.seniverse.com/
  const apiKey = 'SDRb9BvOnW6kdIT41' // 心知天气 密钥
  const response = await fetch(
    `https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=ip`,
  )
  if (toString(response.status) === import.meta.env.VITE_SERVICE_SUCCESS_CODE) {
    const result = get(await response.json(), 'results.[0]')
    weatherInfo.value = result
    console.log(weatherInfo.value, ' weatherInfo.value')
  }
}
fetchWeatherInfo()
</script>

<style scoped>
:deep(.ant-card-head-title) {
  font-weight: bold;
}
</style>
