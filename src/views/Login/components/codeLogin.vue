<template>
  <div class="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-[0_4px_20px_0px_rgba(27,139,140,0.2)] w-[456px] z-10 rounded-lg p-12">
      <h1 class="font-normal text-4xl text-gray-900">登录/注册</h1>
      <a-form
        :model="formState"
        layout="vertical"
        name="login"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="mt-8"
      >
      <a-form-item
        label="手机号"
        name="phoneNumber"
        :rules="[{ required: true, message: '请输入你的手机号！' }]"
      >
        <a-input v-model:value="formState.phoneNumber" type="tel" class="py-2.5 px-3.5" placeholder="输入您的手机号">
          <template #prefix>
            <span class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="验证码"
        name="code"
        :rules="[{ required: true, message: '请输入验证码！' }]"
      >
        <a-input v-model:value="formState.code" class="px-3.5 py-0" placeholder="输入验证码">
          <template #suffix>
            <span @click="onClickGetCode" class="text h-full py-2.5 px-2 cursor-pointer">获取验证码</span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <span class="text-green-1 font-semibold cursor-pointer">切换为密码登陆</span>
      </a-form-item>
      <a-form-item class="mb-0">
        <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto">登录 / 注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue"
import {useUserStore} from "@/stores/user"
const userStore = useUserStore()
const formState = reactive({
  phoneNumber: '',
  code: '',
})
const onFinish = () => {
  console.log('Success:', formState)
  userStore.login(formState)
}
const onClickGetCode = () => {
  userStore.getCode(formState.phoneNumber)
}
</script>