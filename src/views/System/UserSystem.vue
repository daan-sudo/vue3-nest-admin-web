<template>
  <div id="User" class="flex h-full flex-col">
    <SearchCard title="用户管理搜索">
      <a-form :model="searchData" layout="vertical">
        <a-row :gutter="10">
          <a-col :span="8">
            <a-form-item label="用户名">
              <a-input v-model:value="searchData.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="状态">
              <a-select v-model:value="searchData.status" placeholder="请选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label=" ">
              <a-flex justify="end" class="h-full">
                <a-space>
                  <a-button @click="reset">重置</a-button>
                  <a-button @click="getUserList" type="primary">搜索</a-button>
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
        :pagination="pagination"
        :show-pagination="true"
        @refresh="getUserList"
      >
        <template #extra>
          <a-button type="primary" @click="handleAdd">+ 新增用户</a-button>
        </template>
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
          <template v-if="column.dataIndex === 'avatar'">
            <a-avatar :src="record.avatar" />
          </template>
          <template v-if="column.dataIndex === 'sex'">
            <a-tag v-if="record.sex === 1" color="green">男</a-tag>
            <a-tag v-else color="red">女</a-tag>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status === 1" color="green">正常</a-tag>
            <a-tag v-else color="red">禁用</a-tag>
          </template>
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ dayjs(record.createTime).format('YYYY-MM-DD') }}</span>
          </template>
          <template v-if="column.dataIndex === 'department'">
            <span>{{ record.department?.name }}</span>
          </template>
          <template v-if="column.dataIndex === 'roles'">
            <span>{{ formatRole(record.roles) }}</span>
          </template>
        </template>
      </CommonTable>
    </div>
    <!-- 新增用户模态框 -->
    <UserModal ref="userModalRef" @success="getUserList"></UserModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'
import SearchCard from '@/components/SearchCard.vue'
import CommonTable from '@/components/CommonTable.vue'
import { getUserListApi } from '@/api/system'
import UserModal from './components/UserModal.vue'
import type { User } from './types'
import dayjs from 'dayjs'
const initData = {
  username: '',
  status: '',
}
const dataSource = ref<User[]>([])
const userModalRef = useTemplateRef('userModalRef')
const columns = ref([
  { title: '用户名', dataIndex: 'username', key: 'username', width: 100 },
  { title: '昵称', dataIndex: 'nickName', key: 'nickName', width: 100 },
  { title: '头像', dataIndex: 'avatar', key: 'avatar', width: 100 },
  { title: '性别', dataIndex: 'sex', key: 'sex', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '角色', dataIndex: 'roles', key: 'roles', width: 100 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 140 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 100 },
])
const loading = ref(false)
const searchData = reactive({ ...initData })
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
    getUserList()
  },
})
defineOptions({ name: 'system-user' })
const reset = () => {
  searchData.username = ''
  searchData.status = ''
  getUserList()
}
const formatRole = (roles: any[]) => {
  return roles.map((item) => item.name).join(',')
}
// 获取用户列表
const getUserList = async () => {
  console.log('getUserList')
  const data = {
    ...searchData,
    pageSize: pagination.pageSize,
    current: pagination.current,
  }
  loading.value = true
  try {
    const res = await getUserListApi(data)
    console.log(res)
    dataSource.value = res.records
    pagination.total = res.total
    pagination.current = res.current
  } finally {
    loading.value = false
  }
}
getUserList()
// 删除
const handleDelete = async (id: number) => {
  console.log('handleDelete', id)
}
// 编辑
const edit = async (record: any) => {
  userModalRef.value?.open(record)
}
// 新增
const handleAdd = async () => {
  console.log('handleAdd')
  userModalRef.value?.open()
}
</script>

<style lang="scss" scoped></style>
