<template>
  <a-modal
    v-model:open="visible"
    title="上传头像"
    @ok="handleUpload"
    :confirmLoading="uploading"
    width="600px"
  >
    <div class="h-[400px] w-full bg-gray-100">
      <vue-cropper
        ref="cropperRef"
        :img="options.img"
        :outputSize="options.size"
        :outputType="options.outputType"
        :info="true"
        :full="options.full"
        :canMove="options.canMove"
        :canMoveBox="options.canMoveBox"
        :original="options.original"
        :autoCrop="options.autoCrop"
        :fixed="true"
        :checkCrossOrigin="true"
        :fixedNumber="[1, 1]"
        centerBox
      />
    </div>
    <template #footer>
      <a-space>
        <a-upload :before-upload="beforeUpload" :show-upload-list="false">
          <a-button>选择图片</a-button>
        </a-upload>
        <a-button type="primary" :loading="uploading" @click="handleUpload">上传并保存</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { getProxyUrl } from '@/utils/index'
import { uploadApi } from '@/api/system' // 你自己的上传接口

const emit = defineEmits(['success'])
const visible = ref(false)
const uploading = ref(false)
const cropperRef = ref()

const options = reactive({
  img: '', // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  outputType: 'png',
  canMove: true,
  fixedBox: false,
  original: false,
  size: 1,
  canMoveBox: true,
  full: true,
})

const open = (url?: string) => {
  visible.value = true
  if (url) {
    options.img = getProxyUrl(url)
  } else {
    options.img = ''
  }
}

// 选择本地文件
const beforeUpload = (file: File) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    options.img = reader.result as string
  }
  return false // 阻止自动上传
}

// 上传到 OSS
const handleUpload = () => {
  cropperRef.value.getCropBlob(async (blob: Blob) => {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', blob, 'avatar.png')

      // 调用你的上传接口，接口应返回 OSS 的 URL
      const res = await uploadApi(formData)
      emit('success', res)
      visible.value = false
    } finally {
      uploading.value = false
    }
  })
}

defineExpose({ open })
</script>
