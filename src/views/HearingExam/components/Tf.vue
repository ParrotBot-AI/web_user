<template>
  <div class="px-32">
    <h2 class="pt-16 pb-8 text-[#475467] text-xl">{{ props.question_content }}</h2>
    <p class="bg-[#f0f0f0] text-center py-4 mb-3">Click in the correct box for each phrase</p>
    <div class="w-full my-table">
      <div class="my-thead">
        <span v-for="val in columns" :key="val.dataIndex">{{ val.title }}</span>
      </div>
      <div class="my-trow" v-for="(val, ind) in resource" :key="ind">
        <span>
          {{ val[columns[0].dataIndex] }}
        </span>
        <a-radio-group v-model:value="val.checkVal" @change="onchange">
          <a-radio v-for="(val, i) in columns.slice(1)" :key="i" :value="i+1"></a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, computed, watchEffect, reactive } from 'vue'
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
const resource = reactive([])
const columns = computed(() => {
  return [
    {
      title: '',
      dataIndex: 'val',
    },
    ...props.keywords?.h?.map((val,i) => ({
      title: val,
      dataIndex: i,
    }))
  ]
})
const props = defineProps<{
  question_title: string;
  detail: string[];
  keywords: {
    h: string[];
  };
  question_id: number;
  options_label: string[];
  question_content: string;
}>()
watchEffect(() => {
  const answerValue = examStore.examing_data.answerData.find(val => val.question_id === props.question_id)
  resource.length = 0
  resource.push(...props.detail.map((val, i) => ({
    val,
    checkVal: answerValue?.is_answer ? answerValue.answer[i] : -1
  })))
})
const onchange = () => {
  if(resource.every((val) => val.checkVal > -1)) {
    examStore.saveQuestion(props.question_id, resource.map((val) => val.checkVal))
  }
}
</script>
<style scoped>
.my-table {
  border: 1px solid #eee;
}
.my-thead {
  display: flex;
  line-height: 35px;
  height: 40px;
  background: #edf6f6;
  padding: 5px;
}
.my-table span {
  text-align: center;
}
.my-thead>span:nth-child(1), .my-trow>span:nth-child(1){
  flex: 4;
}
.my-thead>span:not(:nth-child(1)){
  flex: 1;
  border-left: 1px solid #eee;
}
.my-trow>div {
  flex: 2;
  display: flex;
}
.my-trow>div>label {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #eee;
}
.my-trow {
  height: 45px;
  display: flex;
  line-height: 40px;
  padding: 5px;
}
</style>