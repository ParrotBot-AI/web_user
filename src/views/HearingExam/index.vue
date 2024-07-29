<template>
  <a-spin v-if="loading" size="large" :tip="$t('试题加载中') + '...'"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
  <template v-else>
    <a-layout class="w-full h-full flex flex-col">
      <b-header :title="query?.name || '模拟考试'">
        <template #right>
          <div class="flex">
            <HeaderBtn v-for="(val, i) in examStore?.curQuestion?.headBtns" v-bind="val" :key="i" />
          </div>
        </template>
      </b-header>
      <BaseGuide v-bind="examStore?.curQuestion"
        v-if="examStore?.curQuestion?.type === 'info' || examStore?.showHelp" />
      <QuestionItem v-else :item="examStore?.curQuestion" title="Listening" />
    </a-layout>
  </template>
</template>
<script setup lang="ts">
import BaseGuide from '@/components/BaseGuide/index.vue';
import { useHearingExam } from '@/stores/hearingExam';
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue";
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import QuestionItem from "./components/QuestionItem.vue";
const examStore = useHearingExam()
const { query } = useRoute()
const loading = ref(true)

onMounted(async () => {
  await examStore.getExamData(query.id as string)
  loading.value = false
})
</script>
<style scoped></style>