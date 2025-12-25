<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTheme } from '@/stores/theme'
import { Icon } from '@iconify/vue'

const store = useTheme()
const { toggle } = store
const { dark: isDark } = storeToRefs(store)
</script>

<template>
  <button
    class="theme-switch"
    :class="{ 'is-dark': isDark }"
    type="button"
    role="switch"
    :aria-checked="isDark"
    @click="toggle"
  >
    <div class="switch-check">
      <Icon icon="material-symbols:sunny" class="icon sun" />
      <Icon icon="material-symbols:nightlight-rounded" class="icon moon" />
    </div>
  </button>
</template>

<style scoped>
/* --- 基础容器 --- */
.theme-switch {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 40px;
  height: 22px;
  /* 3. 增加 fallback 颜色，防止变量未定义导致没有边框 */
  border: 1px solid #d9d9d9;
  border-color: var(--ant-color-border, #d9d9d9);
  border-radius: 11px;
  background-color: var(--ant-color-bg-container-disabled, #f5f5f5);
  cursor: pointer;
  transition:
    border-color 0.25s,
    background-color 0.25s;
}

.theme-switch:hover {
  border-color: #888; /* 简单的 hover 效果 */
}

/* --- 滑块圆球 --- */
.switch-check {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.06);

  /* 核心动画：滑块移动 */
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.25s;

  /* 让内部图标居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* 防止图标溢出 */
}

/* --- 图标通用样式 --- */
.icon {
  position: absolute; /* 4. 关键：让两个图标重叠在一起 */
  font-size: 14px;
  transition:
    opacity 0.25s,
    transform 0.25s; /* 添加 transform 实现缩放动画 */
}

/* --- 太阳样式 (默认显示) --- */
.sun {
  opacity: 1;
  transform: scale(1);
  color: #f59e0b; /* 给太阳加点颜色更生动 */
}

/* --- 月亮样式 (默认隐藏) --- */
.moon {
  opacity: 0;
  transform: scale(0.5); /* 默认缩小，出来时放大 */
  color: #333;
}

/* =========================================
   暗黑模式激活状态 (.is-dark)
   ========================================= */

/* 容器变黑 */
.theme-switch.is-dark {
  border-color: #606060;
  background-color: #2f2f2f;
}

/* 滑块右移 + 变色 */
.theme-switch.is-dark .switch-check {
  background-color: #141414;
  transform: translateX(
    18px
  ); /* 18px = 40px(宽) - 18px(球) - 1px(左border) - 1px(右border) - 2px(保留间隙) */
}

/* 太阳消失 */
.theme-switch.is-dark .sun {
  opacity: 0;
  transform: scale(0.5); /* 缩小消失 */
}

/* 月亮出现 */
.theme-switch.is-dark .moon {
  opacity: 1;
  transform: scale(1);
  color: #fff;
}
</style>
