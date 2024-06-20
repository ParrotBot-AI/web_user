<template>
  <div class="bg-white w-full h-full">
    <BQuesTitle 
      :title="props.title" 
      :index="props.item?.order" 
      :length="examStore.questionData?.sumQuesLength"
    >
      <template #right>
        <BQuesTimer :times="examStore?.questionData?.time_remain" />
      </template>
    </BQuesTitle>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white">
      <BAudio 
        v-if="props.item?.type === 'audio'"
        :ended="onEnded"
        :title="props?.item?.title ? props?.item?.title : 'Please listen carefully.'" 
        class="mt-20"
        img="2" 
        :url="props.item?.voice_link" 
      />
      <template v-else>
        <component :is="quesetionType[props.item?.question_type]" v-bind="props.item as any" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BAudio from "@/components/BaseAudio/index.vue";
import { useHearingExam } from '@/stores/hearingExam';
import { defineProps } from "vue";
import Mc from "./Mc.vue";
import Order from "./Order.vue";
import Sc from "./Sc.vue";
import Tf from "./Tf.vue";
const examStore = useHearingExam()
const quesetionType = {
  'Toefl_Listening_sc': Sc,
  'Toefl_Listening_mc_2': Mc,
  'Toefl_Listening_mc_3': Mc,
  'Toefl_Listening_orde': Order,
  'Toefl_Listening_tf': Tf,
}

const props = defineProps<{
  item: any
}>()
const onEnded = () => {
  examStore.nextQuestion()
}
</script>
<style scoped>


</style>