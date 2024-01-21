<template>
  <div class="bg-login-bg w-full h-full">
    <div class="container h-full flex relative mx-auto">
      <div class="w-1/2 absolute bottom-0 left-0 text-[0px] z-0">
        <img :src="loginBg" alt="login-bg" class="w-full" />
      </div>
      <component :is="loginComponent" />
    </div>
  </div>
</template>
<script setup lang="ts">
import loginBg from '@image/login-bg.jpg'
import { useUserStore } from "@/stores/user";
import { computed } from 'vue';
import CodeLogin from './components/codeLogin.vue'
import PasswordLogin from './components/passwordLogin.vue'
import FindPassword from './components/findPassword.vue'
const LoginComponents = {
  password: PasswordLogin,
  code: CodeLogin,
  findPassword: FindPassword
}
const userStore = useUserStore()
const loginComponent = computed(() => LoginComponents[userStore.loginType])
</script>
