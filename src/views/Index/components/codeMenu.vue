<template>
  <div class="ml-5 mt-10" style="width: 135px; height: 36.463px; flex-shrink: 0">
    <img :src="logoBg" alt="login-bg" class="w-full" />
  </div>
  <a-menu
    class="bg-transparent text-white mt-8 font-misans"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    :items="items1"
    @click="handleClick"
  >
  </a-menu>
  <a-menu
    class="bg-transparent text-white hover:before:text-green-1 pt-8"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    :items="items2"
    @click="handleClick"
  ></a-menu>

  <div class="absolute left-5 bottom-16 w-1/2 text-white flex">
    <img :src="Ellipse" alt="user" />
    <div class="absolute left-11">
      <div>Luna</div>
      <div>138****7894</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, VueElement, h } from 'vue'
import type { MenuProps, ItemType } from 'ant-design-vue'
import { useMenuStore } from '@/stores/menu'
import logoBg from '@image/logo-bg.png'
import HomeLine from '@image/home-line.svg'
import Ellipse from '@image/Ellipse.png'
import { createFromIconfontCN } from '@ant-design/icons-vue'

const customIconFontUrl = '//at.alicdn.com/t/c/font_4417762_uuyyk8jsk1n.js'

const IconFont = createFromIconfontCN({
  scriptUrl: customIconFontUrl
})

const BoardIcon = () => h(IconFont, { type: 'icon-home' })
const BookIcon = () => h(IconFont, { type: 'icon-book2' })
const HearingIcon = () => h(IconFont, { type: 'icon-tinglihui' })
const SpokenIcon = () => h(IconFont, { type: 'icon-Chat' })
const WriteIcon = () => h(IconFont, { type: 'icon-xiezuo' })
const ReciteIcon = () => h(IconFont, { type: 'icon-shijuanpigai' })
const SumIcon = () => h(IconFont, { type: 'icon-rentou' })
const GoalIcon = () => h(IconFont, { type: 'icon-mubiaoguanli' })
const SettingIcon = () => h(IconFont, { type: 'icon-shezhi' })

const userStore = useMenuStore()
const a = userStore.getValue()

console.log(a)

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

function getItem(label: VueElement | string, key: string, icon?: any, type?: 'group'): ItemType {
  return {
    key,
    icon,
    label,
    type
  } as ItemType
}

const items1: ItemType[] = reactive([
  getItem(a[0]['name'], 'sub1', () => h(BoardIcon)),
  getItem(a[1]['name'], 'sub2', () => h(BookIcon)),
  getItem(a[2]['name'], 'sub3', () => h(HearingIcon)),
  getItem(a[3]['name'], 'sub4', () => h(SpokenIcon)),
  getItem(a[4]['name'], 'sub5', () => h(WriteIcon)),
  getItem(a[5]['name'], 'sub6', () => h(ReciteIcon)),
  getItem(a[6]['name'], 'sub7', () => h(SumIcon))
])

const items2: ItemType[] = reactive([
  getItem(a[7]['name'], 'sub8', () => h(GoalIcon)),
  getItem(a[8]['name'], 'sub9', () => h(SettingIcon))
])

const handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

watch(openKeys, (val) => {
  console.log('openKeys', val)
})
</script>

<style></style>
