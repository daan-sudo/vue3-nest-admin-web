<template>
  <div class="flex h-screen bg-[#f3f3f3] overflow-hidden">
    <div class="w-16 bg-[#2e2e2e] flex flex-col items-center py-4 space-y-6 text-gray-400">
      <a-avatar
        :src="userInfo?.avatar"
        :size="36"
        class="mb-2 cursor-pointer border border-gray-600"
      />
      <div class="flex flex-col space-y-6 items-center flex-1">
        <message-filled class="text-xl text-[#07c160] cursor-pointer" />
        <team-outlined class="text-xl hover:text-white cursor-pointer" />
        <appstore-outlined class="text-xl hover:text-white cursor-pointer" />
        <chrome-outlined class="text-xl hover:text-white cursor-pointer" />
      </div>
      <div class="flex flex-col space-y-6 items-center pb-4">
        <mobile-outlined class="text-xl hover:text-white cursor-pointer" />
        <menu-outlined class="text-xl hover:text-white cursor-pointer" />
      </div>
    </div>

    <div class="w-72 bg-[#e6e5e5] border-r border-gray-300 flex flex-col">
      <div class="p-3 pb-2 flex items-center space-x-2">
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
            <search-outlined style="font-size: 12px" />
          </span>
          <input
            type="text"
            placeholder="搜索"
            class="w-full bg-[#d9d8d8] text-xs py-1.5 pl-7 pr-2 rounded focus:outline-none focus:bg-white transition-colors"
          />
        </div>
        <div class="bg-[#d9d8d8] p-1.5 rounded cursor-pointer hover:bg-gray-300">
          <plus-outlined style="font-size: 12px" />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="i in 10"
          :key="i"
          :class="[
            'flex p-3 cursor-pointer items-center space-x-3 hover:bg-[#dcdada]',
            i === 1 ? 'bg-[#c5c4c4]' : '',
          ]"
        >
          <a-badge :count="i === 1 ? 21 : 0" :offset="[0, 0]">
            <a-avatar
              shape="square"
              :size="40"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
            />
          </a-badge>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium truncate">Hydrogen2</span>
              <span class="text-[10px] text-gray-500">15:14</span>
            </div>
            <p class="text-xs text-gray-500 truncate mt-0.5">没呢，还在用 trae 呢</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col bg-[#f3f3f3]">
      <div class="h-14 border-b border-gray-300 flex items-center justify-between px-5">
        <div class="flex flex-col">
          <span class="text-lg font-medium">道磊、Hydrogen2 (3)</span>
        </div>
        <ellipsis-outlined class="text-xl cursor-pointer hover:text-gray-600" />
      </div>

      <div class="flex-1 p-5 overflow-y-auto space-y-6">
        <div class="flex flex-col items-center text-[10px] text-gray-400">15:13</div>

        <div class="flex flex-row-reverse items-start space-x-reverse space-x-3">
          <a-avatar
            shape="square"
            :size="36"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=me"
          />
          <div class="max-w-[70%]">
            <div
              class="bg-[#95ec69] px-3 py-2 rounded-md text-sm relative after:content-[''] after:absolute after:top-3 after:-right-1.5 after:border-y-[6px] after:border-y-transparent after:border-l-[8px] after:border-l-[#95ec69]"
            >
              你们用上 gemini 了吗
            </div>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <a-avatar
            shape="square"
            :size="36"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
          />
          <div class="max-w-[70%]">
            <div class="text-[10px] text-gray-500 mb-1">Hydrogen2</div>
            <div
              class="bg-white px-3 py-2 rounded-md text-sm relative after:content-[''] after:absolute after:top-3 after:-left-1.5 after:border-y-[6px] after:border-y-transparent after:border-r-[8px] after:border-r-white shadow-sm"
            >
              试了下阿里的 qoder，好像叫这个
            </div>
          </div>
        </div>
      </div>

      <div class="h-44 border-t border-gray-300 flex flex-col bg-[#f3f3f3]">
        <div class="flex items-center p-3 space-x-4 text-gray-500">
          <smile-outlined class="text-xl hover:text-gray-800 cursor-pointer" />
          <folder-outlined class="text-xl hover:text-gray-800 cursor-pointer" />
          <scissor-outlined class="text-xl hover:text-gray-800 cursor-pointer" />
          <history-outlined class="text-xl hover:text-gray-800 cursor-pointer" />
        </div>
        <textarea
          class="flex-1 bg-transparent px-5 py-2 resize-none focus:outline-none text-sm"
        ></textarea>
        <div class="flex justify-end p-3">
          <a-button type="default" class="bg-white border-none text-[#07c160] hover:bg-gray-100"
            >发送(S)</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MessageFilled,
  TeamOutlined,
  AppstoreOutlined,
  ChromeOutlined,
  MobileOutlined,
  MenuOutlined,
  SearchOutlined,
  PlusOutlined,
  EllipsisOutlined,
  SmileOutlined,
  FolderOutlined,
  ScissorOutlined,
  HistoryOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
</script>

<style scoped>
/* 针对 Webkit 浏览器优化滚动条样式，使其更像原生客户端 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}
.overflow-y-auto:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}
</style>
