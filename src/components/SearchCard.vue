<template>
  <a-card :bordered="false" class="search-card !mb-4 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 bg-[#00b96b] rounded-full"></div>
        <slot name="title">
          <span class="text-[14px] font-bold text-primary-text">{{ title }}</span>
        </slot>
      </div>

      <div class="flex items-center gap-3">
        <slot name="extra"></slot>
        <a-button
          type="link"
          size="small"
          @click="isExpanded = !isExpanded"
          class="!flex items-center !p-0"
        >
          <span class="mr-1 text-[13px] text-gray-500">{{ isExpanded ? '收起' : '展开' }}</span>
          <up-outlined v-if="isExpanded" class="text-[10px] transition-all duration-300" />
          <down-outlined v-else class="text-[10px] transition-all duration-300" />
        </a-button>
      </div>
    </div>

    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isExpanded" class="overflow-hidden">
        <div class="pt-4">
          <slot></slot>
        </div>
      </div>
    </transition>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'

defineProps({
  title: {
    type: String,
    default: '筛选查询',
  },
})

// 控制折叠状态
const isExpanded = ref(true)

/**
 * 丝滑动画的核心逻辑：通过 JS 计算实际高度
 * 避免了使用 max-height 导致的动画末尾停顿感
 */
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.opacity = '0'
}

const enter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.opacity = '1'
  element.style.transition = 'all 0.3s ease-in-out'
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.opacity = '1'
}

const leave = (el: Element) => {
  const element = el as HTMLElement
  if (element.scrollHeight !== 0) {
    element.style.transition = 'all 0.3s ease-in-out'
    element.style.height = '0'
    element.style.opacity = '0'
  }
}

const afterLeave = (el: Element) => {
  const element = el as HTMLElement
  // element.style.height = 'auto'
  element.style.height = '0' // 修改这里：收起后高度必须为 0
  element.style.opacity = '0'
}
</script>

<style scoped lang="scss">
.search-card {
  :deep(.ant-card-body) {
    padding: 12px 16px; // 紧凑型布局
  }
}
</style>
