<template>
  <div class="flex p-5 w-full h-full">
    <div class="flex flex-col flex-1 pr-4 overflow-hidden">
      <!--用户信息-->
      <div class="pb-7">
        <div class="flex">
          <a-avatar 
            class="bg-green-1"
            style="font-size: 40px;"
            shape="square" 
            :size="120" 
            :src="indexStore.userInfo.avatar" 
            :alt="indexStore.userInfo.username"
          >
            {{ indexStore.userInfo.username[0] || '' }}
          </a-avatar>
          <div class="flex-1 overflow-hidden pl-9">
            <h1 class="text-[30px] text-gray-900 pt-6">{{ getCurrentTimeOfDay() }}好，{{ indexStore.userInfo.username }}</h1>
            <p class="text-gray-600 pt-2">Cease to struggle and you cease to live.</p>
          </div>
        </div>
        <div class="flex mt-16">
          <dl v-for="val in indexStore.userTargets" :key="val.id" class="flex flex-1">
            <dt
              class="w-14 h-14 bg-white flex justify-center items-center rounded-lg border border-solid border-border-1 shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              <img :src="val.icon" />
            </dt>
            <dd class="ml-3.5 -mt-1.5 flex-1 truncate">
              <h4 class="text-[34px] text-green-3">{{ val.val }}</h4>
              <p class="text-gray-500">{{ val.desc }}</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="bg-white rounded-md border border-border-1 border-solid flex-1 px-9 overflow-hidden pb-3">
        <div class="overflow-y-auto h-full relative">
          <BaseCard :title="`今日任务(${indexStore.userTargetsList.today.length})`" :list="indexStore.userTargetsList.today"></BaseCard>
          <div class="flex items-center flex-col text-gray-500 pt-20" v-if="!indexStore.userTargetsList.tomorrow.length">
            <p>暂无当日任务，请先完成模拟考试获取定制任务</p>
            <a-button type="primary" class="mt-5 w-[220px] h-10">开始模考</a-button>
          </div>
          <BaseCard v-if="indexStore.userTargetsList.tomorrow.length" :title="`明日任务(${indexStore.userTargetsList.tomorrow.length})`" :list="indexStore.userTargetsList.today"></BaseCard>
        </div>
      </div>
    </div>
    <AIComponent />
  </div>
</template>
<script setup lang="ts">
import AIComponent from '@/components/AI/index.vue'
import { useIndexStore } from '@/stores/index'
import BaseCard from "@/components/BaseCard/index.vue"
import {getCurrentTimeOfDay} from "@/utils/utils"
const indexStore = useIndexStore()
console.log(indexStore.userInfo)
</script>
