<template>
  <div class="p-4 min-h-full">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="个人信息" :bordered="false" class="h-full">
          <div class="flex flex-col items-center py-6">
            <div class="relative group cursor-pointer" @click="handleEditAvatar">
              <a-avatar :size="120" :src="userInfo?.avatar">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <div
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <camera-outlined class="text-white text-2xl" />
              </div>
            </div>
            <h2 class="mt-4 text-xl font-bold">{{ userInfo?.username }}</h2>
            <p class="text-gray-500">{{ userInfo?.remark || '暂无个人简介' }}</p>
          </div>
          <a-divider />
          <div class="px-4">
            <p><environment-outlined /> 归属部门：{{ userInfo?.department?.name || '未分配' }}</p>
            <p><phone-outlined /> 手机号码：{{ userInfo?.phone || '未绑定' }}</p>
            <p><mail-outlined /> 邮箱地址：{{ userInfo?.email || '未绑定' }}</p>
            <p>
              <calendar-outlined /> 注册时间：{{ dayjs(userInfo?.createTime).format('YYYY-MM-DD') }}
            </p>
          </div>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card :bordered="false">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="基本资料">
              <a-form
                :model="profileForm"
                layout="vertical"
                :rules="profileRules"
                ref="profileFormRef"
                @finish="updateProfile"
                class="max-w-xl"
              >
                <a-form-item label="用户昵称" name="nickName">
                  <a-input v-model:value="profileForm.nickName" />
                </a-form-item>
                <a-form-item required label="手机号码" name="phone">
                  <a-input v-model:value="profileForm.phone" />
                </a-form-item>
                <a-form-item required label="邮箱" name="email">
                  <a-input v-model:value="profileForm.email" />
                </a-form-item>
                <a-form-item label="性别" name="sex">
                  <a-radio-group v-model:value="profileForm.sex">
                    <a-radio :value="1">男</a-radio>
                    <a-radio :value="0">女</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-button type="primary" html-type="submit" :loading="submitLoading"
                  >保存修改</a-button
                >
              </a-form>
            </a-tab-pane>

            <a-tab-pane key="2" tab="修改密码">
              <a-form
                :model="passwordForm"
                :rules="pwdRules"
                layout="vertical"
                @finish="updatePassword"
                class="max-w-xl"
              >
                <a-form-item label="旧密码" name="oldPassword">
                  <a-input-password v-model:value="passwordForm.oldPassword" />
                </a-form-item>
                <a-form-item label="新密码" name="newPassword">
                  <a-input-password v-model:value="passwordForm.newPassword" />
                </a-form-item>
                <a-form-item label="确认新密码" name="confirmPassword">
                  <a-input-password v-model:value="passwordForm.confirmPassword" />
                </a-form-item>
                <a-button type="primary" danger html-type="submit" :loading="submitLoading"
                  >重置密码</a-button
                >
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <AvatarModal ref="avatarModalRef" @success="onAvatarSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CameraOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { updateProfileApi, updatePwdApi } from '@/api/user'
import AvatarModal from '@/views/System/components/AvatarModal.vue'
import { useUserStore } from '@/stores/user'
import { useTabStore } from '@/stores/tab'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const activeKey = ref('1')
const submitLoading = ref(false)
const avatarModalRef = ref()
const profileFormRef = ref<FormInstance>()
const tabStore = useTabStore()

const profileForm = reactive({
  nickName: userInfo.value?.nickName,
  phone: userInfo.value?.phone,
  email: userInfo.value?.email,
  sex: userInfo.value?.sex,
  avatar: userInfo.value?.avatar,
})
// 定义基本资料验证规则
const profileRules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的11位手机号码',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
}
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 加载个人信息
// const fetchUserInfo = async () => {
//   const res = await getInfoApi()
//   userInfo.value = res
//   // 初始化资料表单
//   Object.assign(profileForm, {
//     nickName: res.nickName,
//     phone: res.phone,
//     email: res.email,
//     sex: res.sex,
//   })
// }

// onMounted(fetchUserInfo)

// 头像修改逻辑
const handleEditAvatar = () => {
  avatarModalRef.value.open(userInfo.value?.avatar)
}

const onAvatarSuccess = async (url: string) => {
  // 1. 更新头像 URL 到后端
  // await updateProfileApi({ avatar: url })
  // 2. 刷新页面数据
  userInfo.value!.avatar = url
  profileForm.avatar = url
  message.success('头像更新成功')
}

// 修改资料
const updateProfile = async () => {
  await profileFormRef.value?.validate()
  submitLoading.value = true
  try {
    await updateProfileApi(profileForm)
    message.success('资料修改成功')
    userStore.getInfoApi()
    // fetchUserInfo()
  } finally {
    submitLoading.value = false
  }
}

// 修改密码校验逻辑
const pwdRules = {
  newPassword: [{ required: true, min: 6, message: '密码长度不能少于6位' }],
  confirmPassword: [
    {
      validator: async (_rule: any, value: string) => {
        if (value !== passwordForm.newPassword) throw new Error('两次输入的密码不一致')
      },
    },
  ],
}

const updatePassword = async () => {
  submitLoading.value = true
  try {
    await updatePwdApi(passwordForm)
    message.success('密码修改成功，请重新登录')
    // 此处可执行退出登录逻辑
    userStore.clearAuth()
    tabStore.closeAllTabs()
    router.push('/login')
  } finally {
    submitLoading.value = false
  }
}
</script>
