<template>
  <div class="flex flex-col h-full w-full overflow-y-auto">
    <div class="w-full flex items-center justify-center" style="background: rgba(253, 212, 78, 1);">
      <img :src="Horn"/>
      <div class="pl-[20px]">即日起至5月1日支付9.9元即可获得鹦鹉智学APP三个月会员+超值礼包！</div>
      <div class="font-bold pl-[40px] cursor-pointer" @click="onClickDel">查看详情<div class="h-[1px] bg-black-1 w-16"></div></div>
    </div>
    <div class="flex flex-1 w-full overflow-auto pt-16 pb-10 justify-center">
      <a-table 
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :show-header="false"
        style="width: auto; height: auto;" 
      >
        <template #column1 = "{ text, index }">
          <div class="px-[10px]">
            <div class="text-[15px]">{{ text }}</div>
            <div v-if="index === 7" class="text-[12px] font-normal">无限接近真实考试题，有几率在真实考试中复现。</div>
          </div>
        </template>
        <template #column2 = "{ text, index }">
          <div class="px-[10px]">
            <img v-if="text === 'Contain'" :src="Contain" class="w-[25px]"  alt="Contain" />
            <span v-else >{{ text }}</span>
            <div v-if="index === 0" class="text-[17px] font-bold text-green-1">免费版<div class="text-black-1 text-[30px] pt-[20px]">0元/月<div class="text-[12px] font-normal text-gray-500 pt-[20px]">免费使用我们所有模考，练习系统以及预测题，并获得个人问题诊断。
  免费提供每日一次口语写作批改功能辅助您的学习。<div class="pt-[35px]">5月前注册赠送1年留学顾问。扫描企业微信领取</div></div></div></div>
          </div>
        </template>
        <template #column3 = "{ text, index }">
          <div>
            <img v-if="text === 'Contain' && index !== 7" :src="Contain" class="w-[25px]"  alt="Contain" />
            <img v-else-if="index === 7" :src="Contain" class="w-[25px] pt-[16px] "  alt="Contain" />
            <span v-else >{{ text }}</span>
            <div v-if="index === 0" class="text-[17px] font-bold text-green-1" style="color: rgba(47, 223, 181, 1);">
            <div class="absolute top-0 left-0 w-full" style="background: rgba(47, 223, 181, 1); height: 10px;"><div class="absolute left-0 w-full top-[-25px] text-[12px]">最受欢迎</div></div>练习版会员 
            <div class="text-black-1 text-[30px] pt-[20px]">49元/月
              <div class="text-[12px] font-normal text-gray-500 pt-[20px]">您可使用我们软件的全部功能：包括每日30题批改，实时答疑，单词无痛背诵，全能版心理支持等功能。
                <div class="pt-[35px]">赠送：三年留学顾问</div>
              </div>
            </div>
          </div>
          </div>
        </template>
        <template #column4 = "{ text, index }">
          <div>
            <img v-if="text === 'Contain' && index !== 7" :src="Contain" class="w-[25px] "  alt="Contain" />
            <img v-else-if="index === 7" :src="Contain" class="w-[25px] pt-[16px] "  alt="Contain" />
            <span v-else >{{ text }}</span>
            <div v-if="index === 0" class="text-[17px] font-bold text-green-1" style="color:  rgba(36, 135, 189, 1);">网课保分版会员
              <div class="text-black-1 text-[30px] pt-[20px]">1288/套
                <div class="text-[12px] font-normal text-gray-500 pt-[20px]">在练习版会员的基础上，您将获得网课及每日智能任务功能。我们将附赠您12个月会员及终身留学顾问我们承诺：每日平均学习30分钟，3个月不达100分全额退款。1年内托福出分110+ 获得全额奖学金。
                </div>
              </div>
            </div>
          </div>
        </template>
      </a-table>
      <div class="fixed flex right-4 bottom-8 flex-col">
        <div class="bg-white h-24 w-24 p-2 mb-2">二维码</div>
        <p class="text-[#3B3205]">扫码联系客服</p>
      </div>
    </div>
  </div>
  <a-modal v-model:open="adOpen" class="ad-modal" :footer="null">  
    <img :src="adUrl" width="100%"/>
    <a-button @click="toAD" class="mx-auto block w-[220px] text-[#1B8B8C] border-[#1B8B8C]">领取礼包</a-button>
  </a-modal>
</template>

<script setup lang="ts">
import Contain from '@/assets/images/contain.svg'
import Horn from '@/assets/images/horn.svg'
import { request_menu_ad } from "@/service/user"
import { ref } from "vue"
const adUrl = ref('')
const adOpen = ref(false)
const columns = [
  { 
    dataIndex: 'col1' ,
    width: 228,
    key: 'column1',
    slots: { customRender: 'column1' },
  }, 
  { 
    dataIndex: 'col2',
    key: 'column2',
    width: 238,
    slots: { customRender: 'column2' },
  },
  { 
    dataIndex: 'col3' ,
    key: 'column3',
    width: 238,
    slots: { customRender: 'column3', },
  },
  { 
    dataIndex: 'col4' ,
    key: 'column4',
    width: 238,
    slots: { customRender: 'column4' },
  },
];

const data = [
  { col1: '套餐选择', col2: '', col3: '' , col4:''},
  { col1: '每日智能任务', col2: '无', col3: '简易版', col4: '保分版' },
  { col1: '口语、写作实时批改', col2: '每日1题', col3: '每日30题', col4: '每日30题' },
  { col1: '7*24实时答疑', col2: '无', col3: 'Contain', col4: 'Contain' },
  { col1: '单词无痛背诵', col2: '无', col3: 'Contain', col4: 'Contain' },
  { col1: '心理支持', col2: '简易版', col3: '全能版', col4: '全能版' },
  { col1: '托福模考、练习系统', col2: 'Contain', col3: 'Contain', col4: 'Contain' },
  { col1: '小啾预测题',  col2: 'Contain', col3: 'Contain', col4: 'Contain' },
  { col1: '问题诊断', col2: 'Contain', col3: 'Contain', col4: 'Contain' },
];

const onClickDel = async () => {
  adOpen.value = true
  const { url } = await request_menu_ad()
  adUrl.value = url
}
const toAD = () => {
  window.open('https://work.weixin.qq.com/ca/cawcdebd45fd31b6f9')
}
</script>

<style>

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:first-child{
  vertical-align: top;
  background-color: rgba(198, 224, 215, 0.5);
  font-weight: 700;
  color: #565e6e;
}

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:nth-child(2){
  background-color: rgb(253, 253, 253);
  text-align: center;
}

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:nth-child(3){
  vertical-align: top;
  background-color: rgb(253, 253, 253);
  text-align: center;
}

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:nth-child(4){
  vertical-align: top;
  background-color: rgb(253, 253, 253);
  text-align: center;
}


.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr >td {
  border-top: 1px solid #caced6;
}

.ad-modal.ant-modal{
  top: 300px;
  background: none;
  width: 640px!important;
}
.ad-modal.ant-modal .ant-modal-content {
  background: none;
  box-shadow: none;
}
.ad-modal.ant-modal .ant-modal-close{
  top: 43px;
  inset-inline-end: 67px;
}
</style>

