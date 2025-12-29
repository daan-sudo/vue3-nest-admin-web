<template>
  <div class="p-4 min-h-full flex flex-col gap-4 bg-[#f0f2f5]">
    <a-card :bordered="false" class="shadow-sm">
      <a-form layout="inline" :model="searchState" class="gap-y-4">
        <a-form-item label="菜单名称">
          <a-input v-model:value="searchState.title" placeholder="请输入菜单名称" allow-clear />
        </a-form-item>
        <a-form-item label="路由名称">
          <a-input v-model:value="searchState.routeName" placeholder="请输入路由名称" allow-clear />
        </a-form-item>
        <a-form-item label="创建时间">
          <a-range-picker v-model:value="searchState.dateRange" />
        </a-form-item>
        <a-form-item class="ml-auto">
          <a-space>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" class="!bg-[#00b96b] !border-[#00b96b]" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              查询
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false" title="菜单管理" class="shadow-sm flex-1">
      <template #extra>
        <a-space>
          <a-button type="primary" class="!bg-[#00b96b] !border-[#00b96b]" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
          <a-button @click="fetchData"
            ><template #icon><ReloadOutlined /></template>刷新</a-button
          >
          <a-button
            ><template #icon><SettingOutlined /></template>列设置</a-button
          >
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        row-key="id"
        :pagination="false"
        size="middle"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'type'">
            <a-tag :color="record.type === '目录' ? 'blue' : 'processing'" class="rounded-sm">
              {{ record.type }}
            </a-tag>
          </template>

          <template v-if="column.dataIndex === 'icon'">
            <div class="text-lg flex justify-center">
              <component :is="record.icon" />
            </div>
          </template>

          <template v-if="column.dataIndex === 'sort'">
            <span
              class="px-2 py-0.5 bg-green-50 text-[#00b96b] rounded font-bold border border-green-100"
            >
              {{ record.sort }}
            </span>
          </template>

          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-button type="link" size="small" class="!text-[#00b96b] hover:opacity-80"
                >编辑</a-button
              >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  MonitorOutlined,
  EditOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'
import type { TableProps, ColumnType } from 'ant-design-vue/es/table'

// 1. 搜索表单状态
const searchState = reactive({
  title: '',
  routeName: '',
  dateRange: [] as any[],
})

// 2. 表格列定义
const columns: ColumnType[] = [
  { title: '菜单类型', dataIndex: 'type', key: 'type', width: 100, align: 'center' },
  { title: '菜单名称', dataIndex: 'title', key: 'title', width: 180 },
  { title: '图标', dataIndex: 'icon', key: 'icon', width: 80, align: 'center' },
  { title: '路由名称', dataIndex: 'routeName', key: 'routeName', width: 150 },
  { title: '路由路径', dataIndex: 'path', key: 'path', width: 180 },
  { title: '组件', dataIndex: 'component', key: 'component', ellipsis: true },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]

// 3. 模拟数据 (支持树形)
const dataSource = ref([
  {
    id: 1,
    type: '菜单',
    title: '首页',
    icon: 'MonitorOutlined',
    routeName: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    sort: 1,
    createTime: '2024-08-19 17:05:42',
  },
  {
    id: 2,
    type: '目录',
    title: '系统管理',
    icon: 'SettingOutlined',
    routeName: 'system',
    path: '/system',
    component: 'layout.base',
    sort: 6,
    createTime: '2024-08-20 14:11:55',
    children: [
      {
        id: 21,
        type: '菜单',
        title: '用户管理',
        icon: 'AppstoreOutlined',
        routeName: 'user',
        path: '/system/user',
        component: '@/views/system/user/index.vue',
        sort: 1,
        createTime: '2024-08-20 15:00:00',
      },
      {
        id: 22,
        type: '菜单',
        title: '菜单管理',
        icon: 'EditOutlined',
        routeName: 'menu',
        path: '/system/menu',
        component: '@/views/system/menu/index.vue',
        sort: 2,
        createTime: '2024-08-20 15:10:00',
      },
    ],
  },
])

// 4. 事件处理
const handleSearch = () => {
  console.log('Search:', searchState)
}
const handleReset = () => {
  Object.assign(searchState, { title: '', routeName: '', dateRange: [] })
}
const handleAdd = () => {
  console.log('Add Menu')
}
const fetchData = () => {
  console.log('Refreshing...')
}

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    console.log(`keys: ${selectedRowKeys}`, 'rows: ', selectedRows)
  },
}
</script>

<style lang="scss" scoped>
// 深度修改 Ant Design Vue 样式
:deep(.ant-card-head) {
  @apply border-b border-gray-100 min-h-[56px] flex items-center;
  .ant-card-head-title {
    @apply text-[16px] font-semibold text-gray-700;
  }
}

:deep(.ant-table-thead > tr > th) {
  @apply bg-[#fafafa] font-bold text-gray-600;
}

// 模拟图片中的绿色激活状态样式
:deep(.ant-btn-primary) {
  box-shadow: none;
  &:hover {
    @apply opacity-90 bg-[#00b96b] border-[#00b96b];
  }
}
</style>
