<template>
  <div class="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-[0_4px_20px_0px_rgba(27,139,140,0.2)] w-[456px] z-10 rounded-lg p-12">
      <h1 class="font-normal text-4xl text-gray-900">密码登录</h1>
      <a-form
        :model="formState"
        layout="vertical"
        name="login"
        autocomplete="off"
        @finish="onFinish"
        class="mt-8"
      >
      <a-form-item
        label="用户名或手机号"
        name="username"
        :rules="[{ required: true, message: '请输入你的用户名或手机号！' }]"
      >
        <a-input v-model:value="formState.username" type="tel" class="py-2.5 px-3.5" placeholder="输入您的用户名或手机号"></a-input>
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码！' }]"
      >
        <a-input-password v-model:value="formState.password" class="px-3.5 py-2.5" placeholder="输入密码"></a-input-password>
      </a-form-item>
      <a-form-item>
        <span class="text-green-1 font-semibold cursor-pointer" @click="onClickChangeLogin">切换为验证码登陆</span>
      </a-form-item>
      <a-form-item class="mb-0">
        <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue"
import {useUserStore} from "@/stores/user"
const userStore = useUserStore()
const formState = reactive({
  username: '',
  password: '',
  type: 'account',
})
const onFinish = () => {
  console.log('Success:', formState)
  userStore.login(formState)
}
const onClickChangeLogin = () => {
  userStore.onClickChangeLoginType('code')
}
</script>