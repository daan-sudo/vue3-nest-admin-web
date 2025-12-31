<template>
  <div>
    <a-card> v方法v </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
defineOptions({ name: 'home' })
onMounted(() => {
  console.log('home')
})
onActivated(() => {
  console.log('home-home-antived')
})
</script>

<style lang="scss" scoped></style>
