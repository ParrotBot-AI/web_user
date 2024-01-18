<template>
  <div class="bg-login-bg w-full h-full">
    <div class="container h-full flex relative mx-auto">
      <div class="w-1/2 absolute bottom-0 left-0 text-[0px] z-0">
        <img :src="loginBg" alt="login-bg" class="w-full"/>
      </div>
      <code-login />
    </div>
  </div>
</template>
<script setup lang="ts">
import loginBg from '@image/login-bg.jpg'
import CodeLogin from './components/codeLogin.vue'
</script>
