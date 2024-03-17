<template>
  <div class="flex w-full h-full">
    <div class="flex container flex-col">
      <div class="flex-1 overflow-hidden flex flex-col">
        <RouterLink class="block w-[150px] h-[45px] p-[5px] ml-4" to="/">
          <img :src="logoBg" alt="login-bg" class="w-full h-auto" />
        </RouterLink>
        <a-menu class="bg-transparent text-white mt-8 font-misans my-menu-list flex-1 overflow-y-auto"
          v-model:selectedKeys="indexStore.menuData.current" mode="vertical" :items="indexStore.menuList"
          @click="onClickMenu">
        </a-menu>
      </div>
      <div class="flex text-white mb-24 mt-4 px-3 w-full overflow-hidden items-center cursor-pointer" @click="onClickOut">
        <a-avatar :src="indexStore.userInfo.avatar" :alt="indexStore.userInfo.name" :size="40">
          {{ indexStore.userInfo.name[0] || '' }}
        </a-avatar>
        <div class="mx-1.5 flex-1 overflow-hidden">
          <div class="truncate w-full">{{ indexStore.userInfo.name }}</div>
          <div>{{ indexStore.userInfo.mobile || '136****7890' }}</div>
        </div>
        <img :src="LayOut" alt="layout" class="w-5 h-5 overflow-hidden" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue'
import { useIndexStore } from '@/stores/index'
import { useUserStore } from '@/stores/user'
import logoBg from '@image/logo-bg.png'
import LayOut from '@image/log-out-01.svg'
import { RouterLink, useRouter } from 'vue-router'
const $router = useRouter()
const indexStore = useIndexStore()
const userStore = useUserStore()

const onClickMenu: MenuProps['onClick'] = ({ key }) => {
  $router.push({ path: `/${key}` })
}
const onClickOut = () => {
  userStore.api_out()
  $router.replace('/login')
}
</script>
<style scoped>
.my-menu-list :global(.ant-menu-vertical .ant-menu-item) {
  width: 100%;
  margin-inline: 0;
  border-radius: 0;
}

.my-menu-list :global(.ant-menu-light .ant-menu-item-selected) {
  background: #167778;
  color: #fff;
}

.my-menu-list :global(.ant-menu-light .ant-menu-item:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected)) {
  color: #fff;
}

.my-menu-list :global(.ant-menu-light .ant-menu-item:not(.ant-menu-item-disabled):focus-visible) {
  outline: none;
  outline-offset: 0;
}

.my-menu-list :global(.ant-menu .ant-menu-item .ant-menu-item-icon) {
  opacity: 0.6;
}
</style>
