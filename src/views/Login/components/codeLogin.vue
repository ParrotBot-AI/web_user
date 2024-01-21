<template>
  <div
    class="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-[0_4px_20px_0px_rgba(27,139,140,0.2)] w-[456px] z-10 rounded-lg p-12"
  >
    <h1 class="font-normal text-4xl text-gray-900">验证码登录/注册</h1>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      name="login"
      autocomplete="off"
      @finish="onFinish"
      class="mt-8"
    >
      <a-form-item label="手机号" name="mobile" :rules="rulesRef.mobile">
        <a-input
          v-model:value="formState.mobile"
          type="tel"
          class="py-2.5 px-3.5"
          placeholder="输入您的手机号"
        >
          <template #prefix>
            <span
              class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2"
              >+86</span
            >
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="验证码" name="code" :rules="rulesRef.code">
        <a-input v-model:value="formState.code" class="px-3.5 py-0" placeholder="输入验证码">
          <template #suffix>
            <span
              @click="onClickGetCode"
              class="text h-full py-2.5 px-2 cursor-pointer text-green-1"
            >
              {{ getCodeBtnText }}
            </span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <span class="text-green-1 font-semibold cursor-pointer" @click="onClickChangeLogin"
          >切换为密码登陆</span
        >
      </a-form-item>
      <a-form-item class="mb-0">
        <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto"
          >登录 / 注册</a-button
        >
      </a-form-item>
    </a-form>
    <h4 class="text-center pt-4 font-normal text-gray-600 text-[12px]">
      未注册的手机号验证通过后将直接注册
    </h4>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { mobileRegex } from '@/utils/utils'
import { useGetCode } from '@/utils/useGetCode'
import type {LOGIN_TYPE_SMS} from "@/service/user"
import type { FormInstance } from 'ant-design-vue'
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const { getCodeBtnText, getCode, resetCode } = useGetCode()
const formState = reactive<LOGIN_TYPE_SMS>({
  mobile: '',
  code: '',
  type: 'sms'
})
const rulesRef = reactive({
  mobile: [
    { required: true, message: '请输入你的手机号！' },
    { pattern: mobileRegex, message: '请输入正确的手机号！', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码！' }]
})
const onFinish = () => {
  userStore.api_login(formState)
}
const onClickGetCode = () => {
  formRef.value!.validateFields('mobile').then(() => {
    getCode(formState.mobile, () => {
      userStore.api_sms(formState.mobile, resetCode)
    })
  })
}
const onClickChangeLogin = () => {
  userStore.onClickChangeLoginType('password')
}
</script>
