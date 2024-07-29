<template>
  <div class="fixed right-8 bottom-8 z-50 w-[68px] h-[68px]" :style="transformStyle" @click.stop="onOpen" v-show="!open"
    @mouseenter.stop @mousemove.stop ref="modalTitleRef">
    <img :src="aiassistant" alt="logo" class="w-full h-full select-none" :draggable="false" />
  </div>
  <div class="fixed right-8 bottom-8 z-50" :style="transformStyle1">
    <div v-show="open" class="talk-box flex flex-col">
      <header class="w-full flex pl-[34px] pr-4 items-center justify-between h-[42px] bg-white" ref="modalHeaderRef">
        <span class="w-[68px] h-[68px] absolute -left-[34px]">
          <img :src="aiassistant" alt="aiassistant" class="w-full" />
        </span>
        <h2 class="text-[#475467] text-base font-semibold">{{ $t('鹦鹉AI助教') }}</h2>
        <span class="w-[18px] h-full cursor-pointer flex justify-center items-center" @click.stop="onOpen"
          @mouseenter.stop @mousemove.stop>
          <b class="w-[14px] h-[3px] bg-[#1B8B8C] rounded-md"></b>
        </span>
      </header>
      <!--聊天区-->
      <section class="flex-1 overflow-auto px-6 pt-4 tellList bg-[#F0F7F7]">
        <Item v-for="item in list" :key="item.id" v-bind="item" :onAllEnd="onAllEnd" />
        <div ref="bottom"></div>
      </section>
      <!--快捷tag-->
      <section class="bg-[#F0F7F7] h-[36px] overflow-x-auto overflow-y-hidden flex flex-nowrap items-center over-x px-2"
        v-if="btns.length">
        <a-button class="h-[24px] shrink-0 text-xs mx-[4px] border-[#B2DAC8] rounded-full" v-for="val in btns"
          :key="val.title" @click="onClickTag(val.title)">{{ val.title }}</a-button>
      </section>
      <footer class="flex h-[56px] items-center px-2">
        <a-input class="flex-1 mr-3 h-[36px]" :placeholder="$t('输入你想问的问题')" v-model:value="val" @keyup.enter="onSend" />
        <a-button type="primary" class="h-[36px] flex justify-center items-center" @click="onSend">
          <Icon>
            <template #component>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="send-01">
                  <path id="Icon"
                    d="M9.24537 11.25L17.9954 2.50002M9.35169 11.5234L11.5418 17.1551C11.7347 17.6512 11.8312 17.8993 11.9702 17.9717C12.0907 18.0345 12.2342 18.0345 12.3548 17.9719C12.4939 17.8997 12.5906 17.6517 12.7842 17.1558L18.2761 3.08269C18.4508 2.63504 18.5382 2.41121 18.4904 2.26819C18.4489 2.14398 18.3514 2.04651 18.2272 2.00501C18.0842 1.95723 17.8604 2.04458 17.4127 2.21927L3.33958 7.71122C2.84369 7.90474 2.59574 8.0015 2.52348 8.14059C2.46084 8.26116 2.46093 8.4047 2.52371 8.5252C2.59613 8.66421 2.84419 8.76067 3.34031 8.95361L8.97198 11.1437C9.07269 11.1829 9.12304 11.2024 9.16544 11.2327C9.20302 11.2595 9.23589 11.2924 9.2627 11.3299C9.29294 11.3723 9.31252 11.4227 9.35169 11.5234Z"
                    stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              </svg>
            </template>
          </Icon>
        </a-button>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import aiassistant from '@/assets/images/aiassistant.png';
import { startStream } from "@/service/ai";
import Icon from '@ant-design/icons-vue';
import { useDraggable } from '@vueuse/core';
import { computed, defineProps, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute } from "vue-router";
import Item from "./item.vue";
const timer = ref(null)
const bottom = ref(null)
const props = defineProps<{
  data: any
  type: string
}>()
const aiParams: any = {
  toeflType: '',
  queryType: '',
  chatbotQuery: '',
  'Main Content': '',
  mcq: '',
  problemMethod: ''
}
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
const dragRect1 = ref({ left: 0, right: 0, top: 0, bottom: 0 });
const modalTitleRef = ref<HTMLElement>();
const modalHeaderRef = ref<HTMLElement>();
const { query } = useRoute();
const { x, y, isDragging } = useDraggable(modalTitleRef);
const { x: x1, y: y1, isDragging: isDragging1 } = useDraggable(modalHeaderRef)
const iconPos = reactive({
  startX: 0,
  startY: 0,
  startedDrag: false,
  transformX: 0,
  transformY: 0,
  preTransformX: 0,
  preTransformY: 0
})
const tallPos = reactive({
  startX: 0,
  startY: 0,
  startedDrag: false,
  transformX: 0,
  transformY: 0,
  preTransformX: 0,
  preTransformY: 0
})
const open = ref(false);
const val = ref('')
let starindex = 0;
const list = ref<any[]>([]);
const maps = {
  'read': '阅读',
  'hearing': '听力',
  'spoken': '口语',
  'writing': '写作'
}

watch([x, y], () => {
  if (!iconPos.startedDrag && !open.value) {
    iconPos.startX = x.value;
    iconPos.startY = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = (modalTitleRef.value as HTMLElement).getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    iconPos.preTransformX = iconPos.transformX;
    iconPos.preTransformY = iconPos.transformY;
  }
  iconPos.startedDrag = true;
});
watchEffect(() => {
  if (iconPos.startedDrag && !open.value) {
    const transformX = iconPos.preTransformX +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      iconPos.startX;
    const transformY = iconPos.preTransformY +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      iconPos.startY;
    iconPos.transformX = transformX
    iconPos.transformY = transformY
  }
});
watch([x1, y1], () => {
  if (!tallPos.startedDrag && open.value) {
    tallPos.startX = x1.value;
    tallPos.startY = y1.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = (modalHeaderRef.value as HTMLElement).getBoundingClientRect();
    dragRect1.value.right = bodyRect.width - titleRect.width;
    dragRect1.value.bottom = bodyRect.height - 356;
    tallPos.preTransformX = tallPos.transformX;
    tallPos.preTransformY = tallPos.transformY;
  }
  tallPos.startedDrag = true;
});
watchEffect(() => {
  if (tallPos.startedDrag && open.value) {
    tallPos.transformX =
      tallPos.preTransformX +
      Math.min(Math.max(dragRect1.value.left, x1.value), dragRect1.value.right) -
      tallPos.startX;
    tallPos.transformY =
      tallPos.preTransformY +
      Math.min(Math.max(dragRect1.value.top, y1.value), dragRect1.value.bottom) -
      tallPos.startY;
  }
});
watch([isDragging], () => {
  if (!isDragging) {
    iconPos.startedDrag = false;
  }
});
watch([isDragging1], () => {
  if (!isDragging1) {
    tallPos.startedDrag = false;
  }
});
const onOpen = () => {
  open.value = !open.value
}
const transformStyle = computed(() => {
  return {
    transform: `translate(${iconPos.transformX}px, ${iconPos.transformY}px)`
  };
});
const transformStyle1 = computed(() => {
  return {
    transform: `translate(${tallPos.transformX}px, ${tallPos.transformY}px)`
  };
});
const btns = computed<any>(() => {
  switch (props.type) {
    case 'read':
      aiParams.toeflType = 'Reading'
      return [{
        title: '错题解析',
      }, {
        title: '解题思路',
      }, {
        title: '重点信息',
      }, {
        title: '段落逻辑',
      }]

    case 'hearing':
      aiParams.toeflType = 'Listening'
      return [{
        title: '错题解析',
      }, {
        title: '解题思路',
      }, {
        title: '重点信息',
      }, {
        title: '听力逻辑',
      }]
    case 'spoken':
      aiParams.toeflType = 'Speaking'
      return []
    case 'writing':
      aiParams.toeflType = 'Writing'
      return []
  }
  return []
})
const scrollToBottom = () => {
  // 100毫秒检查一次否滚动到底部
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    bottom.value.scrollIntoView({
      behavior: 'smooth'
    })
  }, 100)
}
const onAllEnd = () => {
  console.log('onAllEnd')
  clearInterval(timer.value)
}
onMounted(() => {
  list.value[0] = {
    type: 'receive',
    id: starindex++,
    name: '',
    content: [`有关于此篇${maps[props.type] || '文章'}的任何问题您都可以提问哦！AI助教会基于您所在的题目页面来回答您提出的问题。`]
  }
})
onUnmounted(() => {
  clearInterval(timer.value)
})
const getMainContent = (data) => {
  switch (props.type) {
    case 'read':
      return `${data?.question_parent?.question_content.join('\n')} \n\n ${data?.detail.join('\n')}`
    case 'hearing':
      return `${data?.question_parent.voice_content} \n\n ${data?.question_content} \n\n ${data?.detail.join('\n')}`
    case 'spoken':
      return `${data?.question?.question_content || ''} \n\n ${data?.question?.title || ''} \n\n ${data?.question?.voice_content || ''}`
    case 'writing':
      return `${data?.question?.question_content} \n\n ${data?.question?.answer} `
  }
}
const getMcq = (data) => {
  switch (props.type) {
    case 'read':
      return data?.question_content
    case 'hearing':
      return `${data?.question_content}`
    case 'spoken':
      return ''
    case 'writing':
      return data?.question?.question_title
  }
}
const connentAI = async (params) => {
  scrollToBottom()
  const { clientId } = await startStream(params)
  const massages = []
  const eventSource = new EventSource(`${import.meta.env.VITE_AI_APP_BASEURL}/v1/modelapi/assistantChatbot/${clientId}/`)
  eventSource.onmessage = function (event) {
    massages.push(event.data.replace(/\[DONE!\]/, ''))
    if (event.data.match(/\[DONE!\]/)) {
      list.value.push({
        type: 'receive',
        id: starindex++,
        isEnd: false,
        content: massages
      })
      eventSource.close()
    }
  }
}

const onSend = () => {
  if (!val.value) {
    return
  }
  list.value.push({
    type: 'send',
    id: starindex++,
    name: '',
    content: val.value
  })
  const params = {
    ...aiParams,
    queryType: '其他问题',
    chatbotQuery: val.value,
    'Main Content': getMainContent(props.data),
  }
  connentAI(params)
  val.value = ''
}
const onClickTag = (title: string) => {
  const mcq_titles = ['错题解析', '解题思路', '重点信息']
  list.value.push({
    type: 'send',
    id: starindex++,
    name: '',
    content: title
  })
  const params = {
    ...aiParams,
    queryType: title,
    'Main Content': getMainContent(props.data),
    mcq: mcq_titles.includes(title) ? getMcq(props.data) : '',
  }
  console.log(params)
  connentAI(params)
}
</script>
<style scoped>
.talk-box {
  width: 395px;
  border-radius: 8px;
  height: 356px;
  border-left: 1px solid var(--Gray-200, #EAECF0);
  background: var(--Base-White, #FFF);
  box-shadow: 0px 5px 24px 0px rgba(16, 24, 40, 0.20);
  overflow: hidden;
}

/** 偶数 */
:global(.tellList>div) {
  margin-bottom: 6px;
}

:global(.tellList>div.right-msg>p) {
  border-radius: 8px 0px 8px 8px;
  font-size: 14px;
  float: right;
  background-color: #1B8B8C;
  color: white;
}

:global(.tellList>div.right-msg>h2) {
  text-align: right;
  display: none;
}

/** 奇数 */
:global(.tellList>div.left-msg>p) {
  border-radius: 0px 8px 8px 8px;
  float: left;
  background-color: #D0F0E6;
  font-size: 14px;
  color: #101828;
}

:global(.tellList>div.left-msg>h2) {
  text-align: left;
}

:global(.tellList>div.left-msg>p div) {
  padding-bottom: 0;
  text-indent: 0;
}

.over-x::-webkit-scrollbar {
  display: none;

}
</style>