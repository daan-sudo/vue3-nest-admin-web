<template>
  <div id="Menu" class="flex h-full flex-col">
    <!-- 搜索栏 -->
    <SearchCard title="菜单管理搜索">
      <a-form :model="searchData" layout="vertical">
        <a-row :gutter="10">
          <a-col :span="6">
            <a-form-item label="菜单名称">
              <a-input v-model:value="searchData.name" placeholder="请输入菜单名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="路由路径">
              <a-input v-model:value="searchData.path" placeholder="请输入路由名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="创建时间">
              <a-range-picker
                @change="handlePickerChnage"
                value-format="YYYY-MM-DD"
                v-model:value="searchData.createTime"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label=" ">
              <a-flex justify="end" class="h-full">
                <a-space>
                  <a-button @click="reset">重置</a-button>
                  <a-button @click="getMenuList" type="primary">搜索</a-button>
                </a-space>
              </a-flex>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </SearchCard>
    <!-- 表格部分 -->
    <div class="flex-1 min-h-0 overflow-hidden" id="table-wrapper">
      <CommonTable
        title="菜单列表"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :show-pagination="false"
        @refresh="fetchData"
      >
        <template #extra>
          <a-button type="primary" @click="handleAdd">+ 新增菜单</a-button>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <span class="font-medium text-primary">{{ record.name }}</span>
          </template>
          <template v-if="column.dataIndex === 'icon'">
            <component :is="record.icon"></component>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ dayjs(record.createTime).format('YYYY-MM-DD') }}</span>
          </template>
          <template v-if="column.dataIndex === 'type'">
            <!-- <span>{{ record.type }}</span> -->
            <a-tag v-if="record.type === MenuType.Directory" color="green">目录</a-tag>
            <a-tag v-else-if="record.type === MenuType.Menu" color="cyan">菜单</a-tag>
            <a-tag v-else-if="record.type === MenuType.Button" color="blue">按钮</a-tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space>
              <a-popconfirm
                title="确定删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button danger>删除</a-button>
              </a-popconfirm>

              <a-button @click="edit(record)" type="primary">编辑</a-button>
            </a-space>
          </template>
        </template>
      </CommonTable>
    </div>
    <!-- 添加菜单弹窗 -->
    <MenuModal ref="menuModalRef" @success="reset" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated, reactive, ref, useTemplateRef } from 'vue'
import SearchCard from '@/components/SearchCard.vue'
import CommonTable from '@/components/CommonTable.vue'
import { getMenuListApi, deleteMenuApi } from '@/api/system'
import type { Menu, MenuListQuery } from '@/views/System/types'
import MenuModal from './components/MenuModal.vue'
import { MenuType } from '@/views/System/enums'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
defineOptions({ name: 'system-menu' })
const columns = [
  { title: '菜单类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '菜单名称', dataIndex: 'name', key: 'name', width: 100 },
  { title: '路由路径', dataIndex: 'path', key: 'path', width: 100 },
  { title: '图标', dataIndex: 'icon', key: 'icon', width: 100 },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 200 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' as const },
]
const searchData = reactive<MenuListQuery>({
  name: '',
  path: '',
  createTime: [],
  createTimeStart: undefined,
  createTimeEnd: undefined,
})
const menuModalRef = useTemplateRef('menuModalRef')
const tableData = ref<Menu[]>([])
const loading = ref(false)
const fetchData = () => {
  getMenuList()
}
const handleAdd = () => {
  console.log('新增')
  menuModalRef.value?.open()
}
const edit = (record: Menu) => {
  menuModalRef.value?.open(record)
}
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100,
})
async function getMenuList() {
  const params = {
    ...searchData,
  }
  loading.value = true
  console.log(params, params.createTime)
  try {
    const res = await getMenuListApi(params)
    console.log(res)
    tableData.value = res
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
// 删除
const handleDelete = async (id: string) => {
  try {
    await deleteMenuApi(id)
    message.success('删除成功')
    getMenuList()
  } catch (error) {
    console.log(error)
  }
}
// 重置
const reset = () => {
  searchData.name = ''
  searchData.path = ''
  searchData.createTime = []
  searchData.createTimeStart = undefined
  searchData.createTimeEnd = undefined
  getMenuList()
}
const handlePickerChnage = (value: string[]) => {
  console.log(value)
  searchData.createTimeStart = value[0]
  searchData.createTimeEnd = value[1]
}
function init() {
  getMenuList()
}
onMounted(() => {
  init()
})
onActivated(() => {
  console.log('menu-menu-antived')
})
</script>

<style lang="scss" scoped>
#Menu {
  height: 100%;
  // background-color: red;
}
</style>
