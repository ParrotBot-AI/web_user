<template>
  <div class="flex flex-col">
    <h1 class="font-normal text-gray-900 sticky top-0 left-0 bg-white py-3 z-50">{{ props.title }}</h1>
    <ul v-if="props.list.length">
      <li v-for="item in props.list" :key="item.id" class="flex justify-between items-center py-4 overflow-hidden">
        <span v-if="item.status === 0" class="text-[12px] py-[2px] px-[6px] text-gray-700 rounded-md btn-status-0"
          :style="{ border: '1px solid var(--color-gray-300)' }">{{ $t('未开始') }}</span>
        <span v-if="item.status === 1" class="text-[12px] py-[2px] px-[6px] rounded-md btn-status-1"
          :style="{ border: '1px solid var(--color-gray-300)' }">{{ $t('进行中') }}</span>
        <span v-if="item.status === 2" class="text-[12px] py-[2px] px-[6px] rounded-md btn-status-2"
          :style="{ border: '1px solid var(--color-gray-300)' }">{{ $t('已完成') }}</span>
        <p class="text-gray-500 flex-1 truncate px-2 text-left indent-5">{{ item.task_name }}</p>
        <a-button v-if="item.status === 0" class="text-[12px] text-green-1 border-green-1" @click="onClick(item)">{{
          $t('去完成') }}</a-button>
        <a-button v-if="item.status === 1" class="text-[12px] text-green-1 border-green-1 ingbtn"
          @click="onClick(item)">{{ $t('继续完成') }}</a-button>
        <a-button v-if="item.status === 2" class="text-[12px] text-yellow-1 border-yellow-1 endbtn">{{ $t('已完成')
          }}</a-button>
      </li>
    </ul>
    <div v-else class="text-xs text-center text-[#999] mt-20">
      {{ $t('此功能为会员功能，如需使用请在“价格”页购买会员') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { request_start_vocabs_tasks } from "@/service/word";
import { defineProps } from 'vue';
import { useRouter } from "vue-router";
const props = defineProps<{
  title: string
  list: Array<any>
}>()
const router = useRouter()
const onClick = async (v) => {
  if (v.task_name === "复习旧单词" || v.task_name === '学习新单词') {
    router.push({
      name: 'wordTask',
      query: {
        type: v.task_name === "复习旧单词" ? 'old' : 'new',
        id: v.task_account_id
      }
    })
  } else {
    const res = await request_start_vocabs_tasks(v.task_account_id)
    console.log(res)
  }
}
</script>
<style scoped>
.btn-status-0:before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-green-1);
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 6px;
}

.btn-status-1:before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-green-1);
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 6px;
}

.btn-status-2:before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-yellow-1);
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 6px;
}

:global(.endbtn.ant-btn-default:not(:disabled):hover) {
  border-color: var(--color-yellow-1);
  color: var(--color-yellow-1);
}

:global(.ingbtn.ant-btn-default:not(:disabled):hover) {
  border-color: var(--color-green-1);
  color: var(--color-green-1);
}
</style>