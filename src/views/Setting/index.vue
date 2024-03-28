<template>
  <div class="flex w-full h-full overflow-y-auto ">
    <a-tabs class="w-full h-full page-tab-setting " >
      <a-tab-pane key="1" tab="个人账号" class="flex  ">
        <div class="bg-white w-[200px] h-[192px] flex flex-col  items-center justify-center border border-border-1 border-solid rounded-md ml-[100px]"  >
          <a-avatar class="bg-green-1 top-[-10px] shadow-lg border border-border-1 border-solid" style="font-size: 40px; width: 48%;" 
          :size="100" :src="indexStore.userInfo.avatar" :alt="indexStore.userInfo.name">
            {{ indexStore.userInfo.name[0] || '' }}
          </a-avatar>

          <div v-if="rev" class=" text-green-1 cursor-pointer " @click="click_rev">编辑头像<div class="h-[1px] bg-green-1 w-16"></div></div>
          <div v-else class="w-full flex flex-col justify-center items-center mb-[-10px]">
            <a-button type="primary" html-type="submit" class="shadow-none w-2/3 px-4 py-1.5 h-auto"
            >{{ $t('更新') }}</a-button
          >
          <div class="text-green-1 py-1">删除</div>
          </div>
        </div>
        <div class="bg-white w-[740px] h-full flex flex-col border border-border-1 border-solid rounded-md p-[80px] ml-[50px]" style="width: 50%;">  
          <h1 class="text-[26px]">账户信息</h1>
          <a-form
          ref="formRef"    
          layout="vertical"
          name="login"
          autocomplete="off"        
          class="mt-8"
           >
           <a-form-item :label="$t('用户名')" name="code" >
              <a-input  class="px-3.5 py-2.5" v-model:value=indexStore.userInfo.name disabled="true">
              </a-input>
            </a-form-item>

           <a-form-item :label="$t('密码')" name="code" >
              <a-input  class="px-3.5 py-0" :placeholder="$t('输入验证码')">
                <template #suffix>
                  <span
                    class="text h-full py-2.5 px-2 cursor-pointer text-green-1 " @click="onClickpassword()"
                  >
                修改密码
                  </span>
                  <a-modal
                  v-model:open="revise_password"
                  closable=false
                  footer= ''
                  class="mt-[100px] my-modal"
                  >
                  <div class="text-[26px] py-[30px] text-black-1">修改密码</div>
                  <a-form-item name="mobile" >
                    <div class="pb-[15px]">手机号</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      v-model:value=indexStore.userInfo.mobile
                      disabled="true"
                    >
                      <template #prefix>
                        <span
                          class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2"
                          >+86</span
                        >
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item name="mobile" >
                    <div class="pb-[15px]">验证码</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      :placeholder= "$t('请输入验证码')"
                    >
                    <template #suffix>
                      <span
                        class="text px-2 cursor-pointer  text-green-1"
                      >
                    获取验证码
                      </span>
                    </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item  name="mobile" >
                    <div class="pb-[15px]">设置新密码</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      :placeholder= "$t('请输入新密码')"
                    >
                    </a-input>
                  </a-form-item>
                  <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto"
                  >{{ $t('确认') }}</a-button
                >
                  </a-modal>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :label="$t('手机号')" name="mobile" >
              <a-input
                type="tel"
                class="py-2.5 px-3.5"
                :placeholder= "$t('您的手机号')"
                v-model:value=indexStore.userInfo.mobile
                disabled="true"
              >
                <template #prefix>
                  <span
                    class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2"
                    >+86</span
                  >
                </template>
                <template #suffix>
                  <span
                    class="text px-2 cursor-pointer  text-green-1" @click="onClicknumber()"
                  >
                修改手机号
                <a-modal
                  v-model:open="revise_number"
                  closable = false
                  class="w-[250px] mt-[100px] my-modal "
                  footer= ''
                  >
                  <div class="text-[26px] py-[30px] text-black-1">修改手机号</div>
                  <a-form-item  name="mobile" >
                    <div class="pb-[15px]">原手机号</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      :placeholder= "$t('您的手机号')"
                      v-model:value=indexStore.userInfo.mobile
                      disabled="true"
                    >
                      <template #prefix>
                        <span
                          class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2"
                          >+86</span
                        >
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item  name="mobile" >
                    <div class="pb-[15px]">验证码</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      :placeholder= "$t('请输入验证码')"
                    >
                    <template #suffix>
                      <span
                        class="text px-2 cursor-pointer  text-green-1"
                      >
                    获取验证码
                      </span>
                    </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item  name="mobile" >
                    <div class="pb-[15px]">设置新手机号</div>
                    <a-input
                      type="tel"
                      class="py-2 px-3.5"
                      :placeholder= "$t('请输入新手机号')"
                    >
                    </a-input>
                  </a-form-item>
                  <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto"
                  >{{ $t('确认') }}</a-button
                >
                  </a-modal>
                  </span>
                </template>
              </a-input>
            </a-form-item>
            <h1 class="text-[26px]">通知提醒管理</h1>
            <a-form-item  name="code" >
              <a-input  class="px-3.5 py-2.5 mt-8" :placeholder="$t('打开网站提醒')">
                <template #addonAfter>
                  <a-switch v-model:checked="isopen_web" />
                </template>
              </a-input>
              <a-input class="px-3.5 py-2.5 mt-8 ant-input-wrapper" :placeholder="$t('打开短信提醒')" >
                <template #addonAfter>
                  <a-switch v-model:checked="isopen_messages" />
                </template>
              </a-input>
            </a-form-item>
          </a-form>

          <a-form-item class="mb-0">
          <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto"
            >{{ $t('更新账户信息') }}</a-button
          >
        </a-form-item>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="关于鹦鹉智学" class="w-full h-full flex items-center justify-center " >
        <div class="bg-white w-[740px] h-[818px] flex border border-border-1 border-solid rounded-md flex-col p-[80px]" style="width: 55%;"> 
          <div class="flex flex-col w-full items-center justify-center">
            <img :src="About" alt="about">
            <span class="text-[20px] pt-3">Version 1.0.0</span>
          </div>
          <h1 class="text-[26px] flex w-1/2 items-start justify-start pt-10">隐私条款</h1>
            <a-form-item  name="code" >
              <a-input  class="px-3.5 py-2.5 mt-8" :placeholder="$t('《鹦鹉智学协议')" disabled="true">
                <template #suffix>
                  <span
                    class="text px-2 cursor-pointer font-bold text-green-1"
                  >
                查看
                  </span>
                </template>
              </a-input>
              <a-input  class="px-3.5 py-2.5 mt-8" :placeholder="$t('《隐私保护指引')" disabled="true">
                <template #suffix>
                  <span
                    class="text px-2 cursor-pointer font-bold text-green-1"
                  >
                查看
                  </span>
                </template>
              </a-input>
              <h1 class="text-[26px] flex w-1/2 items-start justify-start pt-10">反馈意见</h1>
              <div class="flex items-center justify-center">
                <div>添加企业微信</div>
                <div class="flex pl-10">客服邮箱<div class="text-green-1 pl-2">support@parrotbot.com</div></div>
              </div>
            </a-form-item>
        </div>
        
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">

import { useIndexStore } from '@/stores/index'
import  Ellipse  from  '@/assets/images/Ellipse.png';
import  About  from  '@/assets/images/about.svg';
import { ref } from 'vue'

const indexStore = useIndexStore()
console.log(indexStore.userInfo)
const isopen_web = ref(false)
const isopen_messages = ref(false)
const revise_password = ref(false)
const revise_number = ref(false)
const rev = ref(true)



const onClickpassword = () => {
  revise_password.value = true
}

const onClicknumber = () => {
  revise_number.value = true
}

const click_rev = () => {
  rev.value = false
}

</script>

<style>

.page-tab-setting .ant-tabs-nav .ant-tabs-tab {
  margin-right: 40px; /* 标签之间的水平间距 */
}

.page-tab-setting .ant-tabs-nav {
  padding-left: 5.5rem;
  padding-top: 2.5rem;
  padding-right: 1.5rem;
}

.page-tab-setting .ant-tabs-tab {
  font-size: 18px;
  color: #667085; 
}



.page-tab-setting .ant-tabs-tab:hover {
  color: black; 
}
.page-tab-setting .ant-tabs-tab-selected {
  color: black; /* 点击后颜色 */
}

.my-modal .ant-modal {
  height: 500px; /* Or whatever height you want */
}

.ant-input-wrapper .ant-input-group-addon{
  background-color:white;
}

</style>

