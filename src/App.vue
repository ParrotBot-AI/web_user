<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
<a-config-provider
  :theme="{
    token: {
      colorPrimary: '#1b8b8c',
    },
  }"
>
  <RouterView />
</a-config-provider>
</template>

<style scoped>

</style>
