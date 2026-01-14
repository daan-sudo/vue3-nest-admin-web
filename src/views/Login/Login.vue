<template>
  <div
    :class="['login-container', isDark ? 'dark bg-[#0a0a0a]' : 'bg-[#f0f2f5]']"
    class="relative w-full h-screen flex justify-center items-center overflow-hidden transition-colors duration-500"
  >
    <header class="fixed top-0 w-full flex justify-end p-6 z-50">
      <ThemeChange />
    </header>

    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>
    <div v-show="isDark" class="bg-glow bg-glow-3"></div>

    <div
      class="login-card w-[520px] max-sm:w-[90%] p-10 z-10 rounded-[24px] backdrop-blur-[20px] transition-all duration-500 border border-white/30 dark:border-white/20 shadow-2xl bg-white/10 dark:bg-white/10"
    >
      <div class="text-center mb-8">
        <h2
          class="text-[28px] font-bold mb-2 transition-colors"
          :style="{ color: 'var(--text-color)' }"
        >
          清风后台管理系统
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">欢迎回来，请登录您的账号</p>
      </div>

      <a-form :model="loginForm" :rules="rules" layout="vertical" class="custom-form" ref="formRef">
        <a-form-item label="账号" name="username" required>
          <a-input v-model:value="loginForm.username" placeholder="请输入账号" size="large">
            <template #prefix><Icon icon="material-symbols:account-circle-outline" /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password" required>
          <a-input-password
            v-model:value="loginForm.password"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix><Icon icon="material-symbols:lock-outline" /></template>
          </a-input-password>
        </a-form-item>

        <a-form-item label="验证码" name="captcha" required>
          <div class="flex gap-3">
            <a-input
              v-model:value="loginForm.captcha"
              placeholder="请输入"
              size="large"
              class="flex-1"
            >
              <template #prefix><Icon icon="material-symbols:shield-lock-outline" /></template>
            </a-input>
            <div
              class="captcha-img"
              v-html="loginForm.captchaSvg"
              @click="refreshCaptcha"
              title="点击刷新"
            ></div>
          </div>
        </a-form-item>

        <a-button
          :loading="isLoading"
          type="primary"
          block
          size="large"
          class="submit-btn mt-4"
          @click="handleLogin"
        >
          进入系统
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeChange from '@/components/ThemeChange.vue'
import { reactive, ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/theme'
import { message } from 'ant-design-vue'
import { Icon } from '@iconify/vue'
import { getCaptchaApi, loginApi } from '@/api/user'
import { useRouter } from 'vue-router'
const router = useRouter()
// import type { UserInfo } from './types'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const { dark: isDark } = storeToRefs(useTheme())
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  captchaSvg: '',
  captchaKey: '',
})
const isLoading = ref(false)
const formRef = useTemplateRef('formRef')
// 定义校验规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const handleLogin = async () => {
  await formRef.value.validate()
  isLoading.value = true
  try {
    const res = await loginApi(loginForm)
    message.success('登录成功')
    console.log(res, 'res')
    userStore.setTokens(res.access_token, res.refresh_token)
    router.push('/home')
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const init = () => {
  // 初始化逻辑
  getCaptcha()
}
init()
//获取验证码
async function getCaptcha() {
  const res = await getCaptchaApi()
  loginForm.captchaKey = res.captchaKey
  loginForm.captchaSvg = res.svg
}
// 刷新验证码
function refreshCaptcha() {
  getCaptcha()
}
</script>

<style lang="scss" scoped>
/* 1. 变量定义 */
.login-container {
  --text-color: #333;
  &.dark {
    --text-color: #fff;
  }
}

/* 2. 背景球通用样式与动画 */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: move 20s infinite alternate;
}

.bg-glow-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  top: -100px;
  left: -100px;
}

.bg-glow-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #3b82f6, #2dd4bf);
  bottom: -150px;
  right: -100px;
  animation-duration: 25s;
  animation-delay: -5s;
}

.bg-glow-3 {
  width: 300px;
  height: 300px;
  background: rgba(99, 102, 241, 0.3);
  top: 40%;
  right: 20%;
}

@keyframes move {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(100px, 50px) scale(1.1);
  }
}

/* 3. Ant Design 组件深度样式优化 */
:deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* 关键：强制修改内部原生 input 的背景，防止色差 */
  input.ant-input {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    /* 这里的文字颜色也可以顺便统一 */
    color: inherit;
  }
  .dark & {
    background: rgba(0, 0, 0, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.1);
  }
}
/* 暗黑模式适配 */
.dark :deep(.ant-input-affix-wrapper) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.1);

  input.ant-input {
    background: transparent !important;
    color: #fff;
  }
}
.captcha-btn {
  border-radius: 12px !important;
  min-width: 110px;
  color: #6366f1;
  border-color: rgba(99, 102, 241, 0.5);
  .dark & {
    color: #818cf8;
    border-color: rgba(129, 140, 248, 0.5);
    background: transparent;
  }
}

.submit-btn {
  height: 50px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #6366f1, #a855f7) !important;
  border: none !important;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4) !important;
  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
}

:deep(.ant-form-item-label > label) {
  color: var(--text-color) !important;
}
</style>
