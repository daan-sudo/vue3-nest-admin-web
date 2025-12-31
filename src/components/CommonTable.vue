<template>
  <div
    ref="containerRef"
    class="common-table-container bg-app-bg rounded-md shadow-sm flex flex-col h-full overflow-hidden"
  >
    <div class="flex items-center justify-between p-4 border-b border-gray-50">
      <div class="flex items-center gap-2">
        <div class="w-1 h-4 bg-[#00b96b] rounded-full"></div>
        <slot name="title">
          <span class="text-[14px] font-bold text-primary-text">{{ title }}</span>
        </slot>
      </div>

      <div class="flex items-center gap-3">
        <slot name="extra"></slot>

        <a-divider type="vertical" v-if="$slots.extra" />
        <a-space :size="12">
          <a-tooltip title="刷新">
            <reload-outlined
              class="cursor-pointer text-gray-500 hover:text-primary transition-colors"
              @click="$emit('refresh')"
            />
          </a-tooltip>

          <a-space :size="12">
            <a-popover
              title="列设置"
              trigger="click"
              placement="bottomRight"
              overlayClassName="column-setting-popover"
            >
              <template #content>
                <div class="column-setting-list min-w-[180px]">
                  <div class="flex justify-between border-b pb-2 mb-2">
                    <a-checkbox
                      :checked="isAllVisible"
                      :indeterminate="isIndeterminate"
                      @change="toggleAll"
                      >列展示</a-checkbox
                    >
                    <a-button type="link" size="small" @click="resetColumns">重置</a-button>
                  </div>

                  <draggable
                    v-model="localColumns"
                    item-key="dataIndex"
                    handle=".drag-handler"
                    :animation="300"
                  >
                    <template #item="{ element }">
                      <div class="flex items-center py-1 hover:bg-gray-50 px-2 rounded group">
                        <div
                          class="drag-handler cursor-move mr-2 opacity-30 group-hover:opacity-100"
                        >
                          <holder-outlined />
                        </div>
                        <a-checkbox v-model:checked="element.visible" class="flex-1">
                          {{ element.title }}
                        </a-checkbox>
                      </div>
                    </template>
                  </draggable>
                </div>
              </template>
              <a-tooltip title="列设置">
                <setting-outlined class="cursor-pointer text-gray-500 hover:text-primary" />
              </a-tooltip>
            </a-popover>
          </a-space>

          <a-tooltip title="全屏">
            <fullscreen-outlined
              class="cursor-pointer text-gray-500 hover:text-primary transition-colors"
              @click="toggleFullscreen"
            />
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <div class="flex-1 p-4 !min-h-0 overflow-hidden">
      <a-table
        v-bind="$attrs"
        :columns="displayColumns"
        :data-source="dataSource"
        :pagination="showPagination ? paginationConfig : false"
        :row-selection="rowSelection"
        :loading="loading"
        :indent-size="20"
        size="middle"
        :scroll="{ x: 'max-content', y: dynamicScrollY }"
      >
        <template #bodyCell="{ column, index, record }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <slot name="bodyCell" :column="column" :record="record" :index="index"></slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import draggable from 'vuedraggable' // 引入拖拽组件
import { ReloadOutlined, SettingOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useElementSize } from '@vueuse/core'

// 定义表格数据的基础类型
interface TableData {
  [key: string]: any
}

interface TableColumn {
  title: string
  dataIndex?: string
  key?: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | undefined
  visible?: boolean
  [key: string]: any
}

interface Props<T = TableData> {
  title?: string
  columns: TableColumn[]
  dataSource: T[]
  loading?: boolean
  showPagination?: boolean
  pagination?: any
  rowSelection?: any
  scrollY?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据列表',
  loading: false,
  showPagination: true,
  scrollY: 'calc(100vh - 400px)', // 默认减去搜索区和头部的高度
})

const containerRef = ref<HTMLElement | null>(null)
const { height } = useElementSize(containerRef)
const dynamicScrollY = ref<number>(300) // 默认保底高度
const emit = defineEmits(['refresh', 'update:pagination'])

// --- 列设置逻辑 ---
const localColumns = ref(props.columns.map((col) => ({ ...col, visible: col.visible ?? true })))
// 3. 全选/半选状态控制
const isAllVisible = computed(() => localColumns.value.every((col) => col.visible))
const isIndeterminate = computed(() => {
  const visibleCount = localColumns.value.filter((col) => col.visible).length
  return visibleCount > 0 && visibleCount < localColumns.value.length
})
// 自动在最左侧插入计数列
const displayColumns = computed(() => {
  const visibleCols = localColumns.value.filter((col) => col.visible !== false)
  return [
    { title: '序号', key: 'index', width: 70, align: 'center', fixed: 'left' },
    ...visibleCols,
  ]
})
const toggleAll = (e: any) => {
  const val = e.target.checked
  localColumns.value.forEach((col) => (col.visible = val))
}
// 4. 重置功能
const resetColumns = () => {
  localColumns.value = props.columns.map((col) => ({ ...col, visible: true }))
}
// --- 分页配置 ---
const paginationConfig = computed(() => ({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  ...props.pagination,
  onChange: (page: number, pageSize: number) => {
    emit('update:pagination', { ...props.pagination, current: page, pageSize })
  },
}))

// 全屏切换逻辑（简单示例）
const toggleFullscreen = (e: MouseEvent) => {
  const target = e.target as Element | null
  if (!target) return

  const el = target.closest('.common-table-container')
  if (!el) return

  if (!document.fullscreenElement) {
    el.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
// 这个 watch 是有效的，因为 useElementSize 内部封装了 ResizeObserver
watch(height, (newHeight) => {
  console.log('高度变了：', newHeight)
  // 执行你的计算逻辑
  // calculateHeight()
  handleResize()
})
/**
 * 自动计算表格内容区高度
 */
const handleResize = () => {
  // 核心：直接测量父容器（MenuSystem 中那个 id="table-wrapper" 的 div）
  // 这个 div 受 flex-1 控制，它的高度代表了页面真实的“空位”
  const parent = containerRef.value?.parentElement
  if (!parent) return

  // 1. 获取物理空位高度
  const parentHeight = parent.offsetHeight

  // 2. 减去表格内部的固定组件高度
  const titleBarHeight = 65 // 标题栏
  const paddingHeight = 32 // p-4 上下间距
  const tableHeaderHeight = 47 // thead
  const paginationHeight = props.showPagination ? 56 : 0 // 分页

  // 3. 计算结果
  const remainingHeight =
    parentHeight - titleBarHeight - paddingHeight - tableHeaderHeight - paginationHeight

  // 4. 应用高度
  dynamicScrollY.value = remainingHeight > 150 ? remainingHeight : 150
}

// // 使用 ResizeObserver 监听容器尺寸变化（包括搜索栏折叠导致的尺寸变动）
let observer: ResizeObserver | null = null

onMounted(() => {
  observer = new ResizeObserver(() => {
    // 放在 requestAnimationFrame 中避免“ResizeObserver loop limit exceeded”警告
    window.requestAnimationFrame(handleResize)
  })

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.common-table-container {
  height: 100%; /* 填满父级 */
  display: flex;
  flex-direction: column;
}

/* 穿透控制：保持结构为 Flex，但取消 body 的弹性 */
:deep(.ant-table-wrapper),
:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  height: 100% !important;
  display: flex;
  flex-direction: column;
}

:deep(.ant-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

:deep(.ant-table-container) {
  /* 这里去掉 flex: 1，改为 height: 100% */
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ant-table-body) {
  /* ！！！最核心修改：严禁 flex: 1 ！！！ */
  /* 一旦设置了 flex: 1，它就会试图撑开，从而无视 dynamicScrollY 的限制 */
  flex: none !important;
  overflow-y: auto !important;
}
/* 美化滚动条 */
/* 针对 Ant Design Table 滚动条的深度美化 */
:deep(.ant-table-body),
:deep(.ant-table-content) {
  /* 1. 整体宽度和高度 */
  &::-webkit-scrollbar {
    width: 8px; /* 纵向滚动条宽度 */
    height: 8px; /* 横向滚动条高度 */
  }

  /* 2. 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }

  /* 3. 滚动条滑块 (Thumb) */
  &::-webkit-scrollbar-thumb {
    /* 使用半透明颜色，使其在不同背景下都能自然融合 */
    background-color: rgba(144, 147, 153, 0.3);
    border-radius: 10px;
    border: 2px solid transparent; /* 制造边距感 */
    background-clip: content-box;
    transition: background-color 0.3s;
  }

  /* 4. 鼠标悬停在滑块上时加深 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144, 147, 153, 0.5);
  }
}

/* 暗黑模式适配 (如果你的项目通过类名如 .dark 切换) */
.dark :deep(.ant-table-body),
.dark :deep(.ant-table-content) {
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.35);
  }
}
</style>
