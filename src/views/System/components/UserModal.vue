<template>
  <a-modal
    v-model:open="visible"
    :title="formState.id ? '编辑用户' : '新增用户'"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    width="800px"
    center
  >
    <div class="max-h-[65vh] overflow-y-auto px-4">
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="mt-4">
        <a-row :gutter="16">
          <a-col :span="24" class="flex justify-center mb-6">
            <div class="text-center">
              <a-avatar :size="80" :src="formState.avatar">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <div class="mt-2">
                <a-button size="small" @click="handleEditAvatar">{{
                  formState.id ? '修改头像' : '上传头像'
                }}</a-button>
              </div>
            </div>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用户名" name="username">
              <a-input
                v-model:value="formState.username"
                placeholder="请输入用户名"
                :disabled="!!formState.id"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用户昵称" name="nickName">
              <a-input v-model:value="formState.nickName" placeholder="请输入昵称" />
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="!formState.id">
            <a-form-item label="密码" name="password">
              <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="formState.phone" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="归属部门" name="deptId">
              <a-tree-select
                v-model:value="formState.deptId"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="deptTreeData"
                placeholder="请选择部门"
                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                allow-clear
                tree-default-expand-all
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="角色" name="roleIds">
              <a-select
                v-model:value="formState.roleIds"
                mode="multiple"
                style="width: 100%"
                placeholder="请选择角色"
                :options="roleOptions"
                :field-names="{ label: 'name', value: 'id' }"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="性别" name="sex">
              <a-radio-group v-model:value="formState.sex">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="0">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-radio-group v-model:value="formState.status">
                <a-radio :value="1">正常</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <AvatarModal ref="avatarModalRef" @success="onAvatarSuccess" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { createUserApi, updateUserApi, getDeptListApi, getRoleListApi } from '@/api/system'
import AvatarModal from './AvatarModal.vue'
import type { Role } from '../types'

const emit = defineEmits(['success'])
const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

const deptTreeData = ref([])
const avatarModalRef = useTemplateRef('avatarModalRef')
const roleOptions = ref<Role[]>([])

const initialFormState = {
  id: undefined,
  username: '',
  password: '',
  nickName: '',
  phone: '',
  avatar: '',
  email: '',
  deptId: undefined,
  roleIds: [],
  sex: 1,
  status: 1,
}

const formState = reactive({ ...initialFormState })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择归属部门', trigger: 'change' }],
  roleIds: [{ required: true, type: 'array', message: '请至少选择一个角色', trigger: 'change' }],
}
// 打开裁剪弹窗
const handleEditAvatar = () => {
  avatarModalRef.value?.open(formState.avatar)
}
// 获取部门和角色基础数据
const fetchOptions = async () => {
  try {
    const [depts, roles] = await Promise.all([
      getDeptListApi(),
      getRoleListApi({ pageSize: 1000, current: 1 }),
    ])
    deptTreeData.value = depts
    roleOptions.value = roles.records
  } catch (error) {
    console.error('加载选项数据失败:', error)
  }
}

const open = async (record?: any) => {
  visible.value = true
  await fetchOptions()

  if (record) {
    // 编辑：回显处理
    Object.assign(formState, {
      ...record,
      // 如果后端 roles 返回的是对象数组，需要转为 ID 数组
      roleIds: record.roles?.map((r: any) => r.id) || [],
    })
  } else {
    // 新增
    Object.assign(formState, initialFormState)
  }
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    confirmLoading.value = true

    if (formState.id) {
      await updateUserApi(formState)
    } else {
      await createUserApi(formState)
    }

    message.success('操作成功')
    emit('success')
    visible.value = false
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    confirmLoading.value = false
  }
}
// 裁剪上传成功回调
const onAvatarSuccess = (url: string) => {
  console.log(url, 'url')
  formState.avatar = url // 将 OSS 返回的地址绑定到表单
}
const handleCancel = () => {
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>
