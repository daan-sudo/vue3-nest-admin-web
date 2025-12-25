<template>
  <!-- <div id="Login">

  </div> -->
  <div class="login-container" :class="{ dark: isDark }">
    <header class="w-screen flex justify-end h-8 items-center p-6 absolute top-2">
      <ThemeChange></ThemeChange>
    </header>
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>
    <div class="bg-glow-3"></div>

    <div class="login-card">
      <div class="login-header">
        <h2>清风后台管理系统</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>

      <div
        style="
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
        "
      >
        这里放置你的 Ant Design 表单
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeChange from '@/components/ThemeChange.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/theme'
const { dark: isDark } = storeToRefs(useTheme())
</script>

<style lang="scss" scoped>
#Login {
  width: 100vw;
  height: 100vh;
  font-size: large;
}
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* 默认明亮背景色 */
  background-color: #f0f2f5;
  transition: background-color 0.5s ease;
  --text-color: #333;
}

/* 暗黑模式适配 */
.login-container.dark {
  background-color: #0a0a0a;
  --text-color: #fff;
}

/* --- 背景动画色块 --- */
.bg-glow-1,
.bg-glow-2,
.bg-glow-3 {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.6;
  animation: move 20s infinite alternate;
}

/* 球1：蓝色系 */
.bg-glow-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  top: -100px;
  left: -100px;
}

/* 球2：青色系 */
.bg-glow-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #3b82f6, #2dd4bf);
  bottom: -150px;
  right: -100px;
  animation-duration: 25s;
  animation-delay: -5s;
}

/* 球3：暗黑模式下的点缀 */
.bg-glow-3 {
  width: 300px;
  height: 300px;
  background: rgba(99, 102, 241, 0.3);
  top: 40%;
  right: 20%;
  display: none;
}

.dark .bg-glow-3 {
  display: block;
}

/* --- 登录卡片 (毛玻璃效果) --- */
.login-card {
  position: relative;
  z-index: 10;
  width: 520px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.7); /* 明亮模式半透明 */
  backdrop-filter: blur(20px); /* 核心：毛玻璃模糊 */
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
}

.dark .login-card {
  background: rgba(255, 255, 255, 0.05); /* 暗黑模式超薄透明 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.login-header h2 {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: var(--text-color);
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.dark .login-header p {
  color: #aaa;
}

/* --- 浮动动画 --- */
@keyframes move {
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(100px, 50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 100px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

/* 针对移动端的适配 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
    padding: 24px;
  }
}
</style>
