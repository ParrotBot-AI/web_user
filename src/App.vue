<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
<a-style-provider hash-priority="low">
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1b8b8c',
        colorText: '#344054',
        borderRadius: 8,
        fontSize: 16
      },
    }"
  >
  <RouterView />
  </a-config-provider>
</a-style-provider>
</template>

<style scoped>

</style>
