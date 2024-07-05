import { createI18n } from 'vue-i18n'
import en from "@/locals/en"
import cn from "@/locals/cn"
import hu from "@/locals/hu"
import { getWithExpiry } from '@/utils/storage'
const i18n = createI18n({
  locale: getWithExpiry('language') || 'cn', // set locale
  fallbackLocale: 'cn', // set fallback locale
  legacy: false,
  messages: {
    en,
    cn,
    hu
  }
})

export default i18n;
