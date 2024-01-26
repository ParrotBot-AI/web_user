import { Button, message, ConfigProvider, StyleProvider, Form, Input, Layout, Menu, Avatar, Card, Modal, Checkbox, Tabs } from 'ant-design-vue';
import type { App } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
const customIconFontUrl = '//at.alicdn.com/t/c/font_4417762_bqniza776it.js'
export const IconFont = createFromIconfontCN({
  scriptUrl: customIconFontUrl
})
export function registerUI() {
  return (app: App) => {
    app.use(Button)
    app.use(ConfigProvider)
    app.use(StyleProvider)
    app.use(Avatar)
    app.use(Form)
    app.use(Input)
    app.use(Layout)
    app.use(Menu)
    app.use(Card)
    app.use(Modal)
    app.use(Checkbox)
    app.use(Tabs)
    app.component('IconFont', IconFont)
    app.config.globalProperties.$message = message
  }
}