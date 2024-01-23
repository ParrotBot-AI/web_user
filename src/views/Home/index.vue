<template>
  <div class="flex p-5 w-full h-full">
    <div class="flex flex-col flex-1 pr-4">
      <!--用户信息-->
      <div class="pb-7">
        <div>
          <a-avatar shape="square" :size="120"></a-avatar>
        </div>
        <div class="flex mt-16">
          <dl v-for="val in indexStore.userTargets" :key="val.id" class="flex flex-1">
            <dt
              class="w-14 h-14 bg-white flex justify-center items-center rounded-lg border border-solid border-border-1 shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              <img :src="val.icon" />
            </dt>
            <dd class="ml-3.5 -mt-1.5">
              <h4 class="text-[34px] text-green-3">{{ val.val }}</h4>
              <p class="text-gray-500">{{ val.desc }}</p>
            </dd>
          </dl>
        </div>
      </div>
      <!--今日任务-->
      <div class="bg-white rounded-md border border-border-1 border-solid flex-1"></div>
    </div>
    <AIComponent />
  </div>
</template>
<script setup lang="ts">
import AIComponent from '@/components/AI/index.vue'
import { useIndexStore } from '@/stores/index'
const indexStore = useIndexStore()
</script>
