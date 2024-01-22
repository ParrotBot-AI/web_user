import { Button, message, ConfigProvider, StyleProvider, Form, Input, Layout, Menu, Card} from 'ant-design-vue';
import type { App } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
const customIconFontUrl = '//at.alicdn.com/t/c/font_4417762_yydhf30j98j.js'
export const IconFont =  createFromIconfontCN({
  scriptUrl: customIconFontUrl
})
export function registerUI() {
  return (app: App) => {
    app.use(Button)
    app.use(ConfigProvider)
    app.use(StyleProvider)
    app.use(Form)
    app.use(Input)
    app.use(Layout)
    app.use(Menu)
    app.use(Card)
    app.component('IconFont', IconFont)
    app.config.globalProperties.$message = message
  }
}