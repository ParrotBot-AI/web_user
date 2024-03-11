import { createI18n } from 'vue-i18n'
import en from "@/locals/en"
import cn from "@/locals/cn"

const i18n = createI18n({
  locale: 'cn', // set locale
  fallbackLocale: 'cn', // set fallback locale
  messages: {
    en,
    cn
  }
})

export default i18n;
