import { Button, message, ConfigProvider } from 'ant-design-vue';
import type { App } from 'vue'

export function registerUI() {
  return (app: App) => {
    app.use(Button)
    app.use(ConfigProvider)
    app.config.globalProperties.$message = message
  }
}