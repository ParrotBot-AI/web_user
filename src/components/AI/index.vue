<template>
  <div class="flex flex-col w-[368px] bg-white rounded-md border border-border-1 border-solid">
    <header class="flex px-3 py-4 items-center">
      <span class="w-11 h-11 overflow-hidden">
        <img :src="aiassistant" alt="aiassistant" class="w-full"/>
      </span>
      <h2 class="flex-1 pl-3 font-normal text-green-3 py-2.5" :style="{borderBottom: `1px solid var(--color-gray-200)`}">{{ $t('鹦鹉AI助教') }}</h2>
    </header>
    <section class="flex-1 overflow-auto"></section>
    <footer class="flex px-6 py-4" :style="{borderTop: `1px solid var(--color-gray-300)`}">
      <a-input class="flex-1 mr-3 h-10" placeholder="输入消息" />
      <a-button type="primary" class="h-10 flex justify-center items-center">
        <Icon>
          <template #component>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="send-01">
              <path id="Icon" d="M9.24537 11.25L17.9954 2.50002M9.35169 11.5234L11.5418 17.1551C11.7347 17.6512 11.8312 17.8993 11.9702 17.9717C12.0907 18.0345 12.2342 18.0345 12.3548 17.9719C12.4939 17.8997 12.5906 17.6517 12.7842 17.1558L18.2761 3.08269C18.4508 2.63504 18.5382 2.41121 18.4904 2.26819C18.4489 2.14398 18.3514 2.04651 18.2272 2.00501C18.0842 1.95723 17.8604 2.04458 17.4127 2.21927L3.33958 7.71122C2.84369 7.90474 2.59574 8.0015 2.52348 8.14059C2.46084 8.26116 2.46093 8.4047 2.52371 8.5252C2.59613 8.66421 2.84419 8.76067 3.34031 8.95361L8.97198 11.1437C9.07269 11.1829 9.12304 11.2024 9.16544 11.2327C9.20302 11.2595 9.23589 11.2924 9.2627 11.3299C9.29294 11.3723 9.31252 11.4227 9.35169 11.5234Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
          </template>
        </Icon>
      </a-button>
    </footer>
  </div>
</template>
<script setup lang="ts">
import Icon from '@ant-design/icons-vue';
import aiassistant from '@/assets/images/aiassistant.png'
</script>
