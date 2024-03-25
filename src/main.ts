import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerUI } from "@/plugins/ui";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import BHeader from "@/components/BaseHeader/indev.vue";
import BQuesTitle from "@/components/BaseQuesTitle/index.vue";
import App from './App.vue'
import "@/styles/main.css"
import router from './router'
import i18n from './plugins/i18n'

NProgress.configure({ showSpinner: false }); // 配置NProgress

const app = createApp(App)
app.component('BHeader', BHeader)
app.component('BQuesTitle', BQuesTitle)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(registerUI())
app.mount('#app')