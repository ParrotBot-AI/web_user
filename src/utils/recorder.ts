import { message } from 'ant-design-vue'
import Recorder from 'js-audio-recorder'

export function InitRecorder(): Recorder {
  if (window.OReCorder) {
    return window.OReCorder
  }
  const oRecorder = new Recorder({
    sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1
  })
  // 单例模式 创建recorder
  window.OReCorder = oRecorder
  return oRecorder
}

export function getRecorder(): ReturnType<typeof InitRecorder> {
  return InitRecorder()
}

export function start() {
  const recorder = getRecorder()
  return recorder.start()
}

export function stop() {
  const recorder = getRecorder()
  return recorder.getWAVBlob()
}

export function destroy() {
  getRecorder().destroy()
  window.OReCorder = null
}
export async function getMicrophoneAccess() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log('Microphone access granted.')
  } catch (error) {
    message.error(`Microphone access denied:${error}`)
  }
}
export function blobToFile(blob: Blob, fileName: string) {
  // 创建一个新的File对象
  const file = new File([blob], fileName, { type: blob.type })
  return file
}
