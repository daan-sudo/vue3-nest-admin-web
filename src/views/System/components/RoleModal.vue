<template>
  <a-modal
    v-model:open="visible"
    :title="formState.id ? '编辑角色' : '新增角色'"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    width="800px"
    center
  >
    <div class="max-h-[60vh] overflow-y-auto px-4">
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="mt-4">
        <a-row>
          <a-col :span="12">
            <a-form-item label="角色名称" name="name">
              <a-input
                style="width: 90%"
                v-model:value="formState.name"
                placeholder="请输入角色名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色编码" name="code">
              <a-input
                style="width: 90%"
                v-model:value="formState.code"
                placeholder="请输入角色编码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示排序" name="orderNum">
              <a-input-number v-model:value="formState.orderNum" :min="0" style="width: 90%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="角色描述" name="remark">
              <a-textarea v-model:value="formState.remark" placeholder="请输入角色描述" :rows="4" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="菜单权限" name="menuIds">
              <div class="rounded-md p-4 max-h-[300px]">
                <a-tree
                  v-model:checkedKeys="formState.menuIds"
                  :tree-data="menuTreeData"
                  :field-names="{ title: 'name', key: 'id' }"
                  checkable
                  :selectable="false"
                  default-expand-all
                  :checkStrictly="false"
                />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { createRoleApi, getMenuListApi, updateRoleApi } from '@/api/system'
import type { Menu, RoleCreate } from '@/views/System/types'

const emit = defineEmits(['success'])
const visible = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单初始状态
const initialFormState: RoleCreate = {
  id: undefined,
  name: '',
  code: '',
  remark: '',
  orderNum: 0,
  menuIds: [],
}
// 权限相关数据
const menuTreeData = ref<Menu[]>([])
// const checkedMenuIds = ref<number[]>([])
const formState = reactive({ ...initialFormState })

// 校验规则
const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}
// 获取全量菜单树
const fetchMenuTree = async () => {
  try {
    const res = await getMenuListApi()
    menuTreeData.value = res
  } catch (error) {
    console.error('加载菜单树失败:', error)
  }
}
// 开启弹窗方法 (暴露给父组件)
const open = async (record?: any) => {
  visible.value = true
  // 每次打开弹窗时加载菜单数据
  await fetchMenuTree()
  if (record) {
    // 编辑逻辑：填充数据
    Object.assign(formState, record)
  } else {
    // 新增逻辑：重置数据
    Object.assign(formState, initialFormState)
  }
}

const handleOk = async () => {
  // console.log(formState);
  // return
  try {
    await formRef.value?.validate()
    confirmLoading.value = true
    if (formState.id) {
      await updateRoleApi(formState)
    } else {
      await createRoleApi(formState)
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

defineExpose({ open })
</script>
