<template>
  <div class="bg-white w-full h-full">
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{props.title}}</h2>
      <p>Question {{ examStore.examing_data.curIndex + 1 }} of {{ examStore.examing_data.childrenLength }}</p>
      <Timer />
    </div>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <BAudio 
        v-if="props.step === -1"
        :ended="onEnded"
        title="Please listen carefully." 
        class="mt-20"
        img="2" 
        :url="props.voice_link" 
      />
      <template v-else-if="curQuestion">
        <div class="px-32" v-if="curQuestion.question_type === 'Toefl_Listening_sc'">
          <h2 class="pt-32 pb-20">{{ curQuestion.question_title }}</h2>
          <a-radio-group v-model:value="sc_value">
            <a-radio 
              v-for="(val,i) in curQuestion.detail" 
              :key="i" 
              :value="i" 
              class="flex pb-7 text-gray-500 myraido"
            >
              {{curQuestion.options_label[i]}}. {{ val }}
            </a-radio>
          </a-radio-group>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BAudio from "@/components/BaseAudio/index.vue";
import Timer  from "@/views/ReadExam/components/Timer.vue"
import { defineProps, computed, ref} from "vue"
import { useExamStore } from '@/stores/exam'
const examStore = useExamStore()
const sc_value = ref<number>(-1)
const props = defineProps<{
  title: string;
  voice_link: string;
  question_id: number;
  order: number;
  played: boolean;
  step: number;
  voice_content: string;
  onAuidoEnded: (question_id: number, order: number) => void;
  children: Array<{
    question_id: number;
    question_type: string;
    question_content: string;
    detail: string[];
    options_label: string[];
  }>
}>()
const curQuestion = computed(() => {
  return props.children[props.step]
})
const onEnded = () => {
  props.onAuidoEnded(props.question_id, props.order)
}
</script>
<style scoped>
.myraido:global(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: transparent;
}

.myraido :global(.ant-radio-checked .ant-radio-inner::after) {
  background-color: var(--color-green-1);
}

.mycheckbox:global(.ant-checkbox+span),
.myraido:global(.ant-radio-wrapper span.ant-radio+*) {
  flex: 1;
  overflow: hidden;
  display: flex;
}

</style>