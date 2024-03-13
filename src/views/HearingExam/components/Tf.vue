<template>
  <div class="px-32">
    <h2 class="pt-32 pb-20">{{ curQuestion.question_title }}</h2>
    <a-radio-group v-model:value="sc_value">
      <a-radio 
        v-for="(val,i) in curQuestion.detail" 
        :key="i" 
        :value="i" 
        class="flex pb-7 text-gray-500 myraido"
      >
        {{curQuestion.options_label[i]}}. {{ val }}
      </a-radio>
    </a-radio-group>
  </div>
</template>
<script lang="ts" setup>
const sc_value = ref<number>(-1)

</script>
<style scoped>
.myraido:global(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: transparent;
}

.myraido :global(.ant-radio-checked .ant-radio-inner::after) {
  background-color: var(--color-green-1);
}

.mycheckbox:global(.ant-checkbox+span),
.myraido:global(.ant-radio-wrapper span.ant-radio+*) {
  flex: 1;
  overflow: hidden;
  display: flex;
}
</style>