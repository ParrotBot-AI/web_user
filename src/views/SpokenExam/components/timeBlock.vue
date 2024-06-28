<template>
  <div class="flex flex-col items-center justify-center">
    <p class="text-[#475467] py-2">Preparation Time: {{ props.p }} Seconds</p>
    <p class="text-[#475467] py-2">Response Time: {{ props.r }} Seconds</p>
    <div class="w-52 text-center mt-3" :style="{ border: `1px solid #475467` }">
      <h5 class="bg-[#475467] text-white py-2.5">
        {{ props.status === 'prepare' ? 'PREPARATION TIME' : 'RESPONSE TIME' }}
      </h5>
      <p class="text-[#475467] py-3">{{ showTime }}</p>
    </div>
    <a-button
      danger
      type="primary"
      class="w-48 mt-4 h-10"
      :loading="stopRecord"
      v-if="props.status === 'speak'"
      @click="endRecording"
    >
      STOP RECORDING
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { formatTime } from '@/utils/dayjs'
import { getMicrophoneAccess } from '@/utils/recorder'
import { message } from 'ant-design-vue'
import Recorder from 'js-audio-recorder'
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue'

const timer = ref<null | ReturnType<typeof setTimeout>>(null)
const props = defineProps<{
  p: number
  r: number
  status: 'prepare' | 'speak'
  disabledContinue?: () => void
  onended: () => void
}>()
const time = ref(0)
const stopRecord = ref(false)
const recorder = ref<null | Recorder>(null)
const showTime = computed(() => {
  return formatTime(time.value!, 'seconds', 'HH:mm:ss')
})
const end = async () => {
  stopRecord.value = true
  clearInterval(timer.value!)
  if (!recorder.value) {
    message.warning('No recording found')
    return
  }
  const recorderVal = recorder.value?.getWAVBlob()
  if (recorderVal.size <= 44) {
    message.warning(
      '您的录音功能可能未开启，请检查浏览器设置! 或者联系我们工作人员辅助您使用该功能！'
    )
    return
  }
  await props.onended?.(recorderVal)
  recorder.value?.destroy()
  recorder.value = null
  stopRecord.value = false
}
const endRecording = () => {
  end()
}
onMounted(async () => {
  console.log('recording:::mounted', props)
  time.value = props.status === 'prepare' ? props.p : props.r
  if (props.status === 'speak') {
    console.log('recorder---init:::', recorder.value)
    await getMicrophoneAccess()
    recorder.value = new Recorder({
      sampleBits: 16,
      sampleRate: 16000,
      numChannels: 1
    })
    console.log('recorder---start', recorder.value)
    props.disabledContinue && props.disabledContinue()
    await recorder.value.start()
  }
  timer.value = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      end()
    }
  }, 1000)
})
onUnmounted(() => {
  console.log('recording:::unmounted')
  clearInterval(timer.value!)
  timer.value = null
  recorder.value?.destroy()
  recorder.value = null
})
</script>
<style scoped></style>
