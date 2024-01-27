import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerUI } from "@/plugins/ui";
import App from './App.vue'
import "@/styles/main.css"
import router from './router'
import VueNativeSock from "vue-native-websocket-vue3";
import { useSocketStore } from '@/stores/useSocketStore'


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(registerUI())
app.mount('#app')
// 使用VueNativeSock插件，并进行相关配置
app.use(
  VueNativeSock,
  `wss://www.kaisir.cn/websocket/${localStorage.getItem("userID")}`,
  {
    // 启用pinia集成 | enable pinia integration
    store: useSocketStore(app),
    // 数据发送/接收使用使用json
    format: "json",
    // 开启手动调用 connect() 连接服务器
    connectManually: true,
    // 开启自动重连
    reconnection: true,
    // 尝试重连的次数
    reconnectionAttempts: 5,
    // 重连间隔时间
    reconnectionDelay: 3000
  }
);