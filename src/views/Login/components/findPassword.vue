<template>
  <div
    class="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-[0_4px_20px_0px_rgba(27,139,140,0.2)] w-[456px] z-10 rounded-lg p-12">
    <h1 class="font-normal text-4xl text-gray-900">
      <ArrowLeftOutlined class="pr-2" @click="onClickToPassword" />{{ $t('忘记密码') }}
    </h1>
    <a-form ref="formRef" :model="formState" layout="vertical" name="login" autocomplete="off" @finish="onFinish"
      class="mt-8">
      <a-form-item label="手机号" name="mobile" :rules="rulesRef.mobile">
        <a-input v-model:value="formState.mobile" type="tel" class="py-2.5 px-3.5" placeholder="输入您的手机号">
          <template #prefix>
            <span
              class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="验证码" name="code" :rules="rulesRef.code">
        <a-input v-model:value="formState.code" class="px-3.5 py-0" placeholder="输入验证码">
          <template #suffix>
            <span @click="onClickGetCode" class="text h-full py-2.5 px-2 cursor-pointer text-green-1">
              {{ $t(getCodeBtnText) }}
            </span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="设置新密码" name="password" :rules="rulesRef.password">
        <a-input v-model:value="formState.password" class="py-2.5 px-3.5" placeholder="输入新密码">
        </a-input>
      </a-form-item>
      <a-form-item class="mb-0">
        <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto" :loading="loading">{{
          $t('确认') }}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import type { RESRPASSWOED } from "@/service/user";
import { useUserStore } from "@/stores/user";
import { useGetCode } from "@/utils/useGetCode";
import { mobileRegex } from "@/utils/utils";
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { reactive, ref } from "vue";
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref<FormInstance>();
const { getCodeBtnText, getCode, resetCode } = useGetCode()
const formState = reactive<RESRPASSWOED>({
  mobile: '',
  code: '',
  password: ''
})
const rulesRef = reactive({
  mobile: [{ required: true, message: '请输入你的手机号！' }, { pattern: mobileRegex, message: '请输入正确的手机号！', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码！' }],
  password: [{ required: true, message: '请输入密码！' }]
});
const onFinish = async () => {
  try {
    loading.value = true
    await userStore.api_login({
      mobile: formState.mobile,
      code: formState.code,
      type: 'sms'
    }, {
      password: formState.password
    })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
const onClickGetCode = () => {
  formRef.value!.validateFields('mobile').then(() => {
    getCode(formState.mobile, () => {
      userStore.api_sms(formState.mobile, resetCode)
    })
  })
}
const onClickToPassword = () => {
  userStore.onClickChangeLoginType('password')
}
</script>