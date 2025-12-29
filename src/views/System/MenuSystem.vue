<template>
  <div>我是菜单系统管理</div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
defineOptions({ name: 'system-menu' })

onMounted(() => {
  console.log('menu')
})
onActivated(() => {
  console.log('menu-menu-antived')
})
</script>

<style lang="scss" scoped></style>
