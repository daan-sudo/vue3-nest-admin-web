<template>
  <div id="Role" class="flex h-full flex-col">
    <SearchCard title="角色管理搜索">
      <a-form :model="searchData" layout="vertical">
        <a-row :gutter="10">
          <a-col :span="6">
            <a-form-item label="角色名称">
              <a-input v-model:value="searchData.name" placeholder="请输入角色名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="角色编码">
              <a-input v-model:value="searchData.code" placeholder="请输入角色编码" />
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
                  <a-button @click="getRoleList" type="primary">搜索</a-button>
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
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :show-pagination="true"
        :pagination="pagination"
        @refresh="fetchData"
      >
        <template #bodyCell="{ column, record }">
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
  </div>
</template>

<script setup lang="ts">
import SearchCard from '@/components/SearchCard.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { RoleQuery } from '@/views/System/types'
import { getRoleListApi } from '@/api/system'
import { reactive, ref } from 'vue'
import type { Role } from '@/views/System/types'
const loading = ref(false)
const dataSource = ref<Role[]>([])
const columns = ref([
  { title: '角色名称', dataIndex: 'name', key: 'name', width: 100 },
  { title: '角色编码', dataIndex: 'code', key: 'code', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 200 },
  { title: '角色描述', dataIndex: 'remark', key: 'remark', width: 200, ellipsis: true },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150, fixed: 'right' as const },
])
const searchData = reactive<Omit<RoleQuery, 'pageSize' | 'current' | 'id'>>({
  name: '',
  code: '',
  createTime: [],
  createTimeStart: undefined,
  createTimeEnd: undefined,
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (page: number, pageSize: number) => {
    pagination.current = page
    pagination.pageSize = pageSize
    getRoleList()
  },
})
const fetchData = async () => {
  getRoleList()
}
const handlePickerChnage = (value: string[]) => {
  console.log(value)
  searchData.createTimeStart = value[0]
  searchData.createTimeEnd = value[1]
}
const reset = () => {
  searchData.name = ''
  searchData.code = ''
  searchData.createTime = []
  searchData.createTimeStart = undefined
  searchData.createTimeEnd = undefined
  getRoleList()
}
const getRoleList = async () => {
  const params = {
    ...searchData,
    pageSize: pagination.pageSize,
    current: pagination.current,
  }
  loading.value = true
  try {
    const res = await getRoleListApi(params)
    console.log(res)
    dataSource.value = res.records
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}
getRoleList()
// 删除
async function handleDelete(id: string) {}
// 编辑
async function edit(record: any) {}
</script>

<style scoped lang="scss"></style>
