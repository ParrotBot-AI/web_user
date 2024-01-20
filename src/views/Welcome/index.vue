<template>
  <div class="w-full h-full bg-green-2">
    <div class="container h-full flex relative mx-auto">
      <div class="absolute w-[380px] left-10 top-1/2 -translate-y-1/2">
        <h1 class="text-4xl text-gray-900">开始你的学习第一步</h1>
        <p class="text-gray-600 pt-5">在开始之前，我们希望通过几个问题来了解您的学习目标和期望，来为您制定最适合的学习方案。</p>
        <a-form
          layout="vertical"
          class="mt-10"
        >
          <a-form-item
            label="怎么称呼您呢？"
            name="username"
            :rules="rulesRef"
          >
            <a-input v-model:value="formState.username" type="tel" class="py-2.5 px-3.5" placeholder="输入您的手机号">
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto mt-4">下一步</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="absolute right-0 bottom-16 w-1/2">
        <img :src="welcomeBg" alt="welcome" class="w-full"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue"
import welcomeBg from "@/assets/images/welcome-bg.png"
import {useUserStore} from "@/stores/user"
const userStore = useUserStore()
const formState = reactive({
  username: '',
})
</script>
