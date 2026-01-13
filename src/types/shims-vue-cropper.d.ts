/* eslint-disable */
declare module 'vue-cropper' {
  import { DefineComponent } from 'vue'
  // 声明为一个通用的 Vue 组件
  const VueCropper: DefineComponent<{}, {}, any>
  export { VueCropper }

  // 针对报错中提到的具体路径补全
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 解决报错中提到的 ./vue-cropper.vue 找不到定义的问题
declare module '*/vue-cropper.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
