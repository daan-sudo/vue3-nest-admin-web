import './styles/css/global.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 1. 引入所有图标
import * as Icons from '@ant-design/icons-vue'
// 1. 引入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import {
  DatePicker,
  Switch,
  Select,
  ConfigProvider,
  Button,
  Form,
  FormItem,
  Input,
  Layout,
  LayoutSider,
  Menu,
  Breadcrumb,
  Badge,
  Dropdown,
  Avatar,
  Tabs,
  Tooltip,
} from 'ant-design-vue'

const app = createApp(App)
const pinia = createPinia()
app.use(ConfigProvider)
app.use(DatePicker)
app.use(Switch)
app.use(Select)
app.use(Button)
app.use(Form)
app.use(Input)
app.use(Layout)
app.use(Menu)
app.use(Breadcrumb)
app.use(Badge)
app.use(Dropdown)
app.use(Avatar)
app.use(Tabs)
app.use(Tooltip)
// app.use(LayoutSider)
// 2. 循环注册所有图标组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons])
})
// 2. 核心：使用插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
