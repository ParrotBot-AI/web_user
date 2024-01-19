<template>
  <div class="w-full h-full bg-green-2">
    <div class="container h-full flex relative mx-auto">
      <div>
        <h1>开始你的学习第一步</h1>
        <p>在开始之前，我们希望通过几个问题来了解您的学习目标和期望，来为您制定最适合的学习方案。</p>
        <a-form>
          <a-form-item
            label="手机号"
            name="mobile"
            :rules="rulesRef.mobile"
          >
            <a-input v-model:value="formState.mobile" type="tel" class="py-2.5 px-3.5" placeholder="输入您的手机号">
              <template #prefix>
                <span class="text-gray-500 pr-2 relative after:content-[''] after:w-[1px] after:h-5 after:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">+86</span>
              </template>
            </a-input>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
