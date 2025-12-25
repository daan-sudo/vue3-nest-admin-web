import './styles/css/global.css'
import 'ant-design-vue/dist/reset.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { DatePicker, Switch, Select, ConfigProvider } from 'ant-design-vue'

const app = createApp(App)
app.use(ConfigProvider)
app.use(DatePicker)
app.use(Switch)
app.use(Select)

app.use(createPinia())
app.use(router)

app.mount('#app')
