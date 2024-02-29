<template>
  <div class="flex flex-col w-full h-full p-14 overflow-y-auto">
    <h1 class="font-inter text-3xl font-semibold leading-9 mb-10">学习记录</h1>
    <div class="grid grid-cols-6 gap-2 h-[140px]">
      <a-card class="col-span-2 shadow-lg border-solid relative">
        <div class="w-[77px] h-[83px] border-solid absolute top-[-9px] right-6">2200</div>
        <a-card-meta title="7000">
          <template #description>7000</template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta title="64">
          <template #description>64</template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta title="54">
          <template #description>54</template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta title="1164">
          <template #description>1164</template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta title="690">
          <template #description>690</template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="flex-1 grid grid-rows-3 grid-cols-9 gap-2 mt-12">
      <a-card class="col-start-1 col-span-5 row-span-3 shadow-lg">
        1
      </a-card>
      <a-card class="col-start-6 col-span-2 row-span-3 shadow-lg">
        2
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta title="7000">
          <template #description>7000</template>
        </a-card-meta>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta title="7000">
          <template #description>7000</template>
        </a-card-meta>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta title="7000">
          <template #description>7000</template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const $router = useRouter()
</script>
