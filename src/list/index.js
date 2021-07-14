import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import initLog from './log'
import Bus from 'vue3-bus'

const app = createApp(App)
app.use(router)

app.config.globalProperties.$isApp = 'dadadada'
app.config.globalProperties.$bus = Bus

// 日志埋点
const logParams = {}
initLog(app, logParams) // 初始化埋点配置

app.mount('#app')

export { app }
