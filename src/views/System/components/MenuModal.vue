<template>
  <a-modal
    v-model:open="visible"
    :title="formState.id ? '编辑菜单' : '新增菜单'"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    width="650px"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="mt-4">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="菜单类型" name="type">
            <a-radio-group v-model:value="formState.type" button-style="solid">
              <a-radio-button :value="1">目录</a-radio-button>
              <a-radio-button :value="2">菜单</a-radio-button>
              <!-- <a-radio-button :value="3">按钮</a-radio-button> -->
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="上级菜单" name="parentId">
            <a-tree-select
              v-model:value="formState.parentId"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择上级菜单"
              allow-clear
              tree-default-expand-all
              :tree-data="treeData"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="图标" name="icon">
            <a-input v-model:value="formState.icon" placeholder="请输入图标名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单名称" name="name">
            <a-input v-model:value="formState.name" placeholder="请输入菜单名称" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="显示排序" name="orderNum">
            <a-input-number v-model:value="formState.orderNum" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>

        <a-col :span="12" v-if="formState.type !== 3">
          <a-form-item label="路由路径" name="path">
            <a-input v-model:value="formState.path" placeholder="如: /system" />
          </a-form-item>
        </a-col>

        <a-col :span="12" v-if="formState.type !== 1">
          <a-form-item label="权限标识" name="permission">
            <a-input v-model:value="formState.permission" placeholder="如: sys:menu:add" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { getMenuListApi, createMenuApi, updateMenuApi } from '@/api/system'
import type { Menu } from '@/views/System/types'

const emit = defineEmits(['success'])
const treeData = ref<Menu[]>([])
const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单初始状态
const initialFormState = {
  id: undefined,
  parentId: undefined,
  name: '',
  type: 1, // 1目录 2菜单 3按钮
  path: '',
  icon: '',
  permission: '',
  orderNum: 0,
}

const formState = reactive({ ...initialFormState })

// 校验规则
const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  parentId: [{ required: false, message: '请选择上级菜单', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
}

// 开启弹窗方法 (暴露给父组件)
const open = (record?: any) => {
  console.log('record:', record)
  visible.value = true
  if (record) {
    // 编辑逻辑：填充数据
    Object.assign(formState, record)
  } else {
    // 新增逻辑：重置数据
    Object.assign(formState, initialFormState)
  }
}
// /更新
const handleUpdate = async () => {
  const res = await updateMenuApi(formState)
  return res
}
// 添加
const handleAdd = async () => {
  const res = await createMenuApi(formState)
  return res
}
const handleOk = async () => {
  try {
    await formRef.value?.validate()
    confirmLoading.value = true
    console.log('提交数据:', formState)
    if (formState.id) {
      await handleUpdate()
    } else {
      await handleAdd()
    }
    message.success('操作成功')
    emit('success')
    visible.value = false
  } catch (error) {
    console.error('验证失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

const handleCancel = () => {
  formRef.value?.resetFields()
}
async function getTreeData() {
  const res = await getMenuListApi()
  treeData.value = [
    {
      id: 0,
      name: '根节点(0)',
    },
    ...res,
  ]
}
getTreeData()
defineExpose({ open })
</script>
