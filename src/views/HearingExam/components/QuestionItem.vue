<template>
  <div class="bg-white w-full h-full">
    <BQuesTitle 
      :title="props.title" 
      :index="examStore.examing_data.curIndex + 1" 
      :length="examStore.examing_data.childrenLength"
    >
      <template #right>
        <Timer />
      </template>
    </BQuesTitle>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white">
      <BAudio 
        v-if="props.step === -1"
        :ended="onEnded"
        title="Please listen carefully." 
        class="mt-20"
        img="2" 
        :url="props.voice_link" 
      />
      <template v-else-if="curQuestion">
        <component :is="quesetionType[curQuestion.question_type as keyof typeof quesetionType]" v-bind="curQuestion as any" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BAudio from "@/components/BaseAudio/index.vue";
import Timer  from "@/views/ReadExam/components/Timer.vue"
import Sc from "./Sc.vue"
import Mc from "./Mc.vue"
import Tf from "./Tf.vue"
import Order from "./Order.vue"
import { defineProps, computed} from "vue"
import { useExamStore } from '@/stores/exam'
const examStore = useExamStore()
const quesetionType = {
  'Toefl_Listening_sc': Sc,
  'Toefl_Listening_mc_2': Mc,
  'Toefl_Listening_mc_3': Mc,
  'Toefl_Listening_orde': Order,
  'Toefl_Listening_tf': Tf,
}

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
    question_type: keyof typeof quesetionType;
    question_content: string;
    detail: string[];
    options_label: string[];
  }>
}>()
const curQuestion = computed(() => {
  // TODO: 为什么这里会有问题 props.children[props.step] 为 undefined
  console.log('curQuestion::', props.children[props.step])
  return props.children[props.step]
})
const onEnded = () => {
  props.onAuidoEnded(props.question_id, props.order)
}
</script>
<style scoped>


</style>