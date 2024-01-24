<template>
  <div class="w-full h-full bg-green-2">
    <div class="container h-full flex relative mx-auto">
      <div class="absolute w-[380px] left-10 top-1/2 -translate-y-1/2 z-1">
        <h1 class="text-4xl text-gray-900">开始你的学习第一步</h1>
        <p class="text-gray-600 pt-5">
          在开始之前，我们希望通过几个问题来了解您的学习目标和期望，来为您制定最适合的学习方案。
        </p>
        <a-form :model="formState" layout="vertical" class="mt-10" @finish="onFinish">
          <a-form-item
            label="怎么称呼您呢？"
            name="username"
            :rules="[
              {
                required: true,
                message: '请输入您的昵称'
              }
            ]"
          >
            <a-input
              v-model:value="formState.username"
              type="tel"
              class="py-2.5 px-3.5"
              placeholder="输入昵称"
            >
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="shadow-none w-full px-4 py-2.5 h-auto mt-4"
              :loading="loading"
              >下一步</a-button
            >
          </a-form-item>
        </a-form>
      </div>
      <div class="absolute right-0 bottom-16 w-1/2 z-0">
        <img :src="welcomeBg" alt="welcome" class="w-full" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import welcomeBg from '@/assets/images/welcome-bg.png'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import type {USERINFO} from "@/service/user"
import { getWithExpiry } from '@/utils/storage'
const userStore = useUserStore()
const formState = reactive({
  username: ''
})
const loading = ref(false)
const onFinish = async () => {
  try {
    loading.value = true
    // console.log("onFinish");
    const { userId } = getWithExpiry<USERINFO>('userinfo')!
    userStore.api_setUserInfo(userId, {
      name: formState.username
    })
    router.push('/home')
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>
