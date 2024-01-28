import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerUI } from "@/plugins/ui";
import App from './App.vue'
import "@/styles/main.css"
import router from './router'


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(registerUI())
app.mount('#app')