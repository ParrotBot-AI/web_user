import { Button, message, ConfigProvider, StyleProvider, Form, Input, Layout } from 'ant-design-vue';
import type { App } from 'vue'

export function registerUI() {
  return (app: App) => {
    app.use(Button)
    app.use(ConfigProvider)
    app.use(StyleProvider)
    app.use(Form)
    app.use(Input)
    app.use(Layout)
    app.config.globalProperties.$message = message
  }
}