import { createI18n } from 'vue-i18n'
import en from "@/locals/en.ts"
import cn from "@/locals/cn.ts"

const i18n = createI18n({
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    cn
  }
})

export default i18n;
