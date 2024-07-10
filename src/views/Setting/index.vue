<template>
  <div class="flex w-full h-full overflow-y-auto ">
    <a-tabs class="w-full h-full page-tab-setting ">
      <a-tab-pane key="1" tab="个人账号" class="flex">
        <div
          class="bg-white w-[200px] flex shrink-0 h-[fit-content] flex-col items-center justify-center border border-border-1 border-solid rounded-md ml-[100px] pb-4">
          <div class="w-[100px] h-[100px] relative rounded-full overflow-hidden my-4">
            <div v-if="!rev" class="updateAvatar">
              <CameraOutlined v-if="!cacheAvatar" />
              <img :src="cacheAvatar" v-if="cacheAvatar" class="max-w-full max-h-full" />
              <input type="file" class="opacity-0 absolute left-0 top-0 w-full h-full"
                accept=".jpg,.png,.gif,.jpeg,.svg" @change="onchange" />
            </div>
            <a-avatar v-show="!cacheAvatar"
              class="bg-green-1 overflow-hidden shadow-lg border border-border-1 border-solid"
              :class="{ avatarEdit: !rev }" style="font-size: 40px;" :size="100" :src="indexStore.userInfo.avatar"
              :alt="indexStore.userInfo.name">
              <img :src="avatar" width="70%" class="mt-[26px]" />
            </a-avatar>
          </div>
          <div v-if="rev" class="text-green-1 cursor-pointer decoration-solid decoration-green-1 underline"
            @click="click_rev">{{ $t('编辑头像') }}</div>
          <div v-else class="w-full flex flex-col justify-center items-center mb-[-10px]">
            <a-button type="primary" html-type="submit" class="shadow-none w-2/3 px-4 py-1.5 h-auto"
              @click="updataAvatarInfo">{{ $t('更新') }}</a-button>
            <div class="text-green-1 py-1 cursor-pointer" @click="click_rev">{{ $t('删除') }}</div>
          </div>
        </div>
        <div
          class="bg-white w-[740px] h-full flex flex-col border border-border-1 border-solid rounded-md p-[80px] ml-[50px]"
          style="width: 50%;">
          <h1 class="text-[26px]">{{ $t('账户信息') }}</h1>
          <a-form ref="formRef" layout="vertical" name="login" autocomplete="off" class="mt-8" :model="userInfo"
            @finish="onsubmitUserinfo">
            <a-form-item :label="$t('用户名')" name="name">
              <a-input class="px-3.5 py-2.5" v-model:value="userInfo.name">
              </a-input>
            </a-form-item>
            <a-form-item :label="$t('密码')" name="password">
              <a-input class="px-3.5 py-0" :placeholder="$t('输入密码')" value="password" type="password">
                <template #suffix>
                  <span class="text h-full py-2.5 px-2 cursor-pointer text-green-1 " @click="onClickpassword()">
                    {{ $t('修改密码') }}
                  </span>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :label="$t('手机号')" name="mobile">
              <a-input type="tel" class="py-2.5 px-3.5" :placeholder="$t('您的手机号')"
                v-model:value=indexStore.userInfo.mobile disabled="true">
                <template #prefix>
                  <span
                    class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
                </template>
                <template #suffix>
                  <span class="text px-2 cursor-pointer  text-green-1" @click="onClicknumber()">
                    {{ $t('修改手机号') }}
                  </span>
                </template>
              </a-input>
            </a-form-item>
            <h1 class="text-[26px]">{{ $t('通知提醒管理') }}</h1>
            <a-form-item name="code">
              <a-input class="mt-8 setting-item" :placeholder="$t('打开网站提醒')" disabled>
                <template #addonAfter>
                  <a-switch v-model:checked="isopen_web" />
                </template>
              </a-input>
              <a-input class="mt-8 setting-item" :placeholder="$t('打开短信提醒')" disabled>
                <template #addonAfter>
                  <a-switch v-model:checked="isopen_messages" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item class="mb-6" label="请选择语言模式:" name="region">
              <a-select :value="language" placeholder="请选择语言模式" size="large" @change="(val) => {
                setWithExpiry('language', val)
                language = val
                locale = val
              }">
                <a-select-option value="cn">汉语</a-select-option>
                <a-select-option value="en">英语</a-select-option>
                <a-select-option value="hu">匈牙利语</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="mb-0">
              <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto">{{ $t('更新账户信息')
                }}</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="关于鹦鹉智学" class="w-full h-full flex items-center justify-center ">
        <div class="bg-white w-[740px] h-[818px] flex border border-border-1 border-solid rounded-md flex-col p-[80px]"
          style="width: 50%;">
          <div class="flex flex-col w-full items-center justify-center">
            <img :src="About" alt="about">
            <span class="text-[20px] pt-3">Version 1.0.0</span>
          </div>
          <h1 class="text-[26px] flex w-1/2 items-start justify-start pt-10">{{ $t('隐私条款') }}</h1>
          <a-form-item name="code">
            <a-input class="px-3.5 py-2.5 mt-8" :placeholder="$t('《鹦鹉智学协议》')" disabled="true">
              <template #suffix>
                <span class="text px-2 cursor-pointer font-bold text-green-1" @click="toLink">
                  {{ $t('查看') }}
                </span>
              </template>
            </a-input>
            <a-input class="px-3.5 py-2.5 mt-8" :placeholder="$t('《隐私保护指引》')" disabled="true">
              <template #suffix>
                <span class="text px-2 cursor-pointer font-bold text-green-1" @click="toLink">
                  {{ $t('查看') }}
                </span>
              </template>
            </a-input>
            <h1 class="text-[26px] flex w-1/2 items-start justify-start pt-10">{{ $t('反馈意见') }}</h1>
            <div class="flex items-center h-full justify-between">
              <div class="flex flex-col mt-2" style="width: 30%;"><img :src="erweima" style="width: 127px;" />
                <div class="w-[127px] flex justify-center items-center text-[16px] text-[#475467]">{{ $t('添加企业微信') }}
                </div>
              </div>
              <div class="text-[16px] mr-10"><span class="text-[#475467]">{{ $t('客服邮箱') }}</span><a
                  herf="mailto:frank_fan@parrotbot.cn" class="text-green-1 pl-2">{{ $t('frank_fan@parrotbot.cn') }}</a>
              </div>
            </div>
          </a-form-item>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <a-modal v-model:open="revise_password" closable=false footer='' class="mt-[100px] my-modal">
    <div class="text-[26px] py-[30px] text-black-1">{{ $t('修改密码') }}</div>
    <a-form ref="formRef1" :model="formState" layout="vertical" name="login" autocomplete="off" @finish="onFinish">
      <a-form-item label="手机号" name="mobile" :rules="rulesRef.mobile">
        <a-input v-model:value="formState.mobile" type="tel" class="py-2.5 px-3.5" placeholder="输入您的手机号">
          <template #prefix>
            <span
              class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item label="验证码" name="code" :rules="rulesRef.code">
        <a-input v-model:value="formState.code" class="px-3.5 py-0" placeholder="输入验证码">
          <template #suffix>
            <span @click="onClickGetCode" class="text h-full py-2.5 px-2 cursor-pointer text-green-1">
              {{ $t(getCodeBtnText) }}
            </span>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="设置新密码" name="password" :rules="rulesRef.password">
        <a-input v-model:value="formState.password" class="py-2.5 px-3.5" placeholder="输入新密码">
        </a-input>
      </a-form-item>
      <a-form-item class="mb-0">
        <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto" :loading="loading">{{
          $t('确认') }}</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:open="revise_number" closable=false class="w-[250px] mt-[100px] my-modal " footer=''>
    <div class="text-[26px] py-[30px] text-black-1">{{ $t('修改手机号') }}</div>
    <a-form-item name="mobile">
      <div class="pb-[15px]">{{ $t('原手机号') }}</div>
      <a-input type="tel" class="py-2 px-3.5" :placeholder="$t('您的手机号')" v-model:value=indexStore.userInfo.mobile
        disabled="true">
        <template #prefix>
          <span
            class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="mobile">
      <div class="pb-[15px]">{{ $t('验证码') }}</div>
      <a-input type="tel" class="py-2 px-3.5" :placeholder="$t('请输入验证码')">
        <template #suffix>
          <span class="text px-2 cursor-pointer  text-green-1">
            {{ $t('获取验证码') }}
          </span>
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="mobile">
      <div class="pb-[15px]">{{ $t('设置新手机号') }}</div>
      <a-input type="tel" class="py-2 px-3.5" :placeholder="$t('请输入新手机号')">
      </a-input>
    </a-form-item>
    <a-button type="primary" html-type="submit" class="shadow-none w-full px-4 py-2.5 h-auto">{{
      $t('确认') }}</a-button>
  </a-modal>
</template>

<script setup lang="ts">
import About from '@/assets/images/about.svg';
import avatar from "@/assets/images/avatat.jpg";
import erweima from '@/assets/images/erweima.jpg';
import { uploadFileToOBS } from "@/service/file";
import type { RESRPASSWOED } from "@/service/user";
import { useIndexStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { getWithExpiry, setWithExpiry } from '@/utils/storage';
import { useGetCode } from "@/utils/useGetCode";
import { mobileRegex } from "@/utils/utils";
import { CameraOutlined } from "@ant-design/icons-vue";
import type { FormInstance } from 'ant-design-vue';
import { message } from "ant-design-vue";
import { reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const indexStore = useIndexStore()
const cacheAvatar = ref('')
const isopen_web = ref(false)
const isopen_messages = ref(false)
const revise_password = ref(false)
const revise_number = ref(false)
const rev = ref(true)
const loading = ref(false)
const formRef = ref<FormInstance>();
const { getCodeBtnText, getCode, resetCode } = useGetCode()
const { locale } = useI18n()
const language = ref(getWithExpiry('language'));

const userInfo = reactive({
  name: '',
  password: '',
  mobile: ''
})
const formState = reactive<RESRPASSWOED>({
  mobile: '',
  password: '',
  code: ''
})
const rulesRef = reactive({
  mobile: [{ required: true, message: '请输入你的手机号！' }, { pattern: mobileRegex, message: '请输入正确的手机号！', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码！' }],
  password: [{ required: true, message: '请输入密码！' }]
});
watch(() => indexStore.userInfo?.name, () => {
  userInfo.name = indexStore.userInfo.name
}, {
  immediate: true
})
const onFinish = async () => {
  try {
    loading.value = true
    await userStore.api_findPassword(formState)
    revise_password.value = false
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
const onsubmitUserinfo = () => {
  updataInfo({
    name: userInfo.name
  })
}
const onClickGetCode = () => {
  formRef.value!.validateFields('mobile').then(() => {
    getCode(formState.mobile, () => {
      userStore.api_sms(formState.mobile, resetCode)
    })
  })
}
const toLink = () => {
  window.open('https://yingwuzhixue.com/legal.html', '__blank')
}

const onchange = async (e) => {
  if (e.target.files[0]) {
    const res = await uploadFileToOBS(e.target.files[0])
    cacheAvatar.value = res.url
  }
}
const updataInfo = async (data) => {
  const { userId } = getWithExpiry('userinfo')!
  message.success('更新成功！')
  await userStore.api_setUserInfo(userId, data)
  await indexStore.requestUserInfo(userId)
  rev.value = true
  cacheAvatar.value = ''
}
const updataAvatarInfo = () => {
  updataInfo({
    avatar: cacheAvatar.value
  })
}
const onClickpassword = () => {
  revise_password.value = true
}

const onClicknumber = () => {
  revise_number.value = true
}

const click_rev = () => {
  rev.value = !rev.value
}



</script>

<style>
.page-tab-setting .ant-tabs-nav .ant-tabs-tab {
  margin-right: 40px;
  /* 标签之间的水平间距 */
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
  color: black;
  /* 点击后颜色 */
}

.my-modal .ant-modal {
  height: 500px;
  /* Or whatever height you want */
}

.ant-input-wrapper .ant-input-group-addon {
  background-color: white;
}

.avatarEdit {
  position: relative;
}

.updateAvatar {
  position: absolute;
  z-index: 100;
  background: rgba(0, 0, 0, .7);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  cursor: pointer;
}

.setting-item .ant-input-group>.ant-input:first-child {
  height: 50px;
}

.setting-item .ant-input-disabled {
  background-color: #fff;
  border-right: none;
  cursor: pointer;
}
</style>
