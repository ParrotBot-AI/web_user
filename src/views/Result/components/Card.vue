<template>
  <div class="relative bg-wrap">
    <div class="bg-white rounded-md relative z-10 px-14 pb-14 pt-20" :style="{boxShadow: `0px 4px 20px 0px rgba(27, 139, 140, 0.20)`}">
      <div class="w-[190px] h-[137px] result-icon absolute -top-[70px] left-1/2 -translate-x-1/2">
        <span class="absolute w-[46px] h-[46px] flex justify-center items-center text-white right-[40px] text-2xl">{{ resultStore.resultData.level }}</span>
      </div>
      <div class="w-[56vw] h-full">
        <div class="summary-wrap" :class="resultStore.curData?.layout">
          <h5 v-if="resultStore.curData?.subtitle" class="absolute left-8 top-7 text-base"> {{ resultStore.curData?.subtitle }}</h5>
          <div class="flex items-center justify-center flex-col">
            <h2 class="text-gray-600 font-normal text-[16px]">{{ resultStore.curData?.name }}</h2>
            <p class="font-bold text-gray-600 pt-2">
                <span class="text-[36px]">{{ resultStore.curData?.mockScore }}</span><span class="text-[24px]"> / {{
          resultStore.curData?.mockScoreTotal }}</span>
              </p>
          </div>
          <ul class="flex">
            <li v-for="(val, i) in resultStore.curData?.list" :key="i" class="list-none flex items-center justify-center flex-col">
              <!--听力数据-->
              <template v-if="val.children">
                <h2 class="text-black font-semibold text-base mb-2">{{ val.title }}</h2>
                <ul class="flex">
                  <li v-for="(v, j) in val.children" :key="j" class="flex flex-col items-center px-2">
                    <h4 class="font-normal text-[#475467] text-nowrap">{{ v.title }} 错题</h4>
                    <p class="font-bold text-gray-600">
                      <span class="text-[36px] text-[#C33473]">{{ v.count }}</span><span class="text-[24px]"> / {{ v.total }}</span>
                    </p>
                  </li>
                </ul>
              </template>
              <!--其他数据-->
              <template v-else>
                <h2 class="text-[#475467] font-normal text-base mb-2">{{ val.title }}</h2>
                <p class="font-bold text-gray-600" v-if="val.isComputed">
                  <span class="text-[36px]">{{ val.count }}</span><span class="text-[24px]"> / {{ val.total }}</span>
                </p>
                <p v-else>
                  <span class="text-xs text-gray-600 opacity-90">正在打分中...</span>
                </p>
              </template>
            </li>
          </ul>
        </div>
        <div class="flex flex-wrap" v-if="resultStore.curData?.tags?.length">
          <span v-for="(val, i) in resultStore.curData?.tags" :key="i"
            class="px-4 py-1.5 rounded-full text-gray-600 bg-[#E7EAEE] text-[16px] mx-2">
            {{ val.title }}: {{ val.correct }}/{{ val.total }}
          </span>
        </div>
        <div 
          v-if="resultStore.curData?.aiComment"
          :style="{ background: 'rgba(208, 240, 230, 0.50)' }"
          class="rounded-md p-5 pt-6 mt-12 ai-comment relative text-gray-500 text-[16px] leading-6"
        >{{ resultStore.curData?.aiComment }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useResultStore } from "@/stores/result"
const resultStore = useResultStore()
const {query} = useRoute()
const customData = computed(() => {
  return resultStore.customData[query.type]
})


</script>
<style scoped>
.bg-wrap {
  position: relative;
}
.bg-wrap:after, .bg-wrap:before{
  content: '';
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 0;
}
.bg-wrap:before {
  width: 222px;
  height: 419px;
  background-image: url('@/assets/images/r-l.png');
  left: -177px;
  bottom: -70px;
}
.bg-wrap:after {
  width: 165px;
  height: 268px;
  background-image: url('@/assets/images/r-r.png');
  right: -123px;
  bottom: -68px;
}
.summary-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-wrap.col {
  flex-direction: column;
}
.summary-wrap.col> div {
  margin-bottom: 30px;
}
.summary-wrap.row {
  flex-direction: row;
  padding-top: 30px;
}
.summary-wrap.row>ul {
  flex: 1;
  padding-left: 20px;
}
.summary-wrap>ul>li {
  padding: 0 20px;
}
.summary-wrap.row>div{
  position: relative;
  border-right: #D0D5DD 1px solid;
  padding-right: 40px;
}


.result-icon {
  background: url('@/assets/images/result-icon.jpg') no-repeat;
  background-size: 100% 100%;
}

.ai-comment:before {
  content: '';
  position: absolute;
  width: 120px;
  height: 32px;
  background: url('@/assets/images/aititle.png') no-repeat;
  background-size: cover;
  top: -18px;
  left: -20px;
}

</style>