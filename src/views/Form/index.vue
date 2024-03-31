<template>
    <div class=" bg-form w-full h-full flex flex-col items-center ">
        <div class="w-1/8 absolute top-7 left-5 text-[0px] z-0">
            <img :src="Back" alt="login-bg" class="w-full" />
        </div>
        <div class="w-1/2 absolute bottom-0 left-0 text-[0px] z-0">
        <img :src="Form1" alt="login-bg" class="w-1/3" />
        </div>
        <div v-if="index===1" class="flex flex-col w-full  items-center justify-center mb-[-100px] " style="height: 80%;"> 
            <div class="text-gray-600">学习目标</div>
            <div class="my-2 text-[2vw]">问题1 </div>
            <div class="text-gray-600">您目前的学习阶段是？</div>
            <div class="flex w-full justify-center mt-10" style=" height: 30%">
                <div v-for="(v,i) in question[0]" :key="i"  class="flex flex-col items-center justify-center bg-white border border-border-1 border-solid rounded-md mx-5" style="width: 14%; " :style="{ backgroundColor: v.backgroundColor }" @click="toggleImage(0, i)">
                    <img :src="v.isselect ? v.selectimg : v.img" class="w-1/2" >
                    <div class=" mt-4" :style="{ color: v.isselect ? 'white' : 'black' }">{{ v.title }}</div>
                </div>
            </div>
        </div>
        <div v-if="index===2" class="flex flex-col w-full  items-center justify-center mb-[-100px] " style="height: 80%;"> 
            <div class="text-gray-600">学习目标</div>
            <div class="my-2 text-[2vw]">问题2 </div>
            <div class="text-gray-600">您的学习目的是？</div>
            <div class="flex w-full justify-center mt-10" style=" height: 30%">
                <div v-for="(v,i) in question[1]" :key="i" class="flex flex-col items-center justify-center bg-white border border-border-1 border-solid rounded-md mx-5" style="width: 14%; " :style="{ backgroundColor: v.backgroundColor }" @click="toggleImage(1, i)">
                    <img :src="v.isselect ? v.selectimg : v.img" class="w-1/2">
                    <div class=" mt-4">{{ v.title }}</div>
                </div>
            </div>
        </div>
        <div v-if="index===3" class="flex flex-col w-full  items-center justify-center mb-[-100px] " style="height: 80%;"> 
            <div class="text-gray-600">学习目标</div>
            <div class="my-2 text-[2vw]">问题3 </div>
            <div class="text-gray-600">您是否正在机构补习托福？</div>
            <div class="flex w-full justify-center mt-10" style=" height: 30%">
                <div v-for="(v,i) in question[2]" :key="i" class="flex flex-col items-center justify-center bg-white border border-border-1 border-solid rounded-md mx-5" style="width: 14%; " :style="{ backgroundColor: v.backgroundColor }" @click="toggleImage(2, i)">
                    <img :src="v.isselect ? v.selectimg : v.img" class="w-1/2">
                    <div class=" mt-4">{{ v.title }}</div>
                </div>
            </div>
        </div>
        <div class="w-full flex flex-col items-center mb-[200px]" >
            <div class="w-full flex items-center justify-center mb-7">
                <a-button  class="bg-login-bg shadow-none w-1/22 py-2 h-auto mr-7 " @click="subindex">
                    <img :src="Left" class="w-full">
                </a-button>
                <a-button type="primary" class="shadow-none w-1/6 px-4 py-2.5 h-auto " @click="addindex">下一步</a-button>
            </div>
                <a-progress :percent="percent" :showInfo="false" strokeColor="#F3B84E" style="width: 22%;" />
                <div class="text-gray-500">问题{{ index }}/3</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Form1 from '@image/form-1.svg'
import JuniorSchool from '@/assets/images/juniorschool.svg'
import JuniorSchoolSelect from '@/assets/images/juniorschool-select.svg'
import HighSchool from '@/assets/images/highschool.svg'
import HighSchoolSelect from '@/assets/images/highschool-select.svg'
import University from '@/assets/images/university.svg'
import UniversitySelect from '@/assets/images/university-select.svg'
import Workplace from '@/assets/images/workplace.svg'
import WorkplaceSelect from '@/assets/images/workplace-select.svg'
import Study from '@/assets/images/study.svg'
import StudySelect from '@/assets/images/study-select.svg'
import Work from '@/assets/images/work.svg'
import WorkSelect from '@/assets/images/work-select.svg'
import Improve from '@/assets/images/improve.svg'
import ImproveSelect from '@/assets/images/improve-select.svg'
import Tutoring from '@/assets/images/tutoring.svg'
import TutoringSelect from '@/assets/images/tutoring-select.svg'
import Tutor from '@/assets/images/tutor.svg'
import TutorSelect from '@/assets/images/tutor-select.svg'
import Selfstudy from '@/assets/images/selfstudy.svg'
import SelfstudySelect from '@/assets/images/selfstudy-select.svg'
import Left from '@/assets/images/left2.svg'
import Back from '@/assets/images/back.svg'
import {ref} from 'vue'
const index = ref(1)
const percent = ref(index.value*33)
const backgroundColor = ref('')

const addindex = () => {
    if(index.value < 3){
        index.value++
    }else{
        index.value=3
    }
    percent.value = index.value*33
}
const subindex = () => {
    if (index.value > 1 && index.value <= 3) {
        index.value--;
    } else {
        index.value = 1;
    }
    percent.value = index.value*33
}


const question = ref([
      [
        { id: 1, title: '初中', img: JuniorSchool,selectimg: JuniorSchoolSelect, backgroundColor: 'white', isselect: false },
        { id: 2, title: '高中', img: HighSchool, selectimg: HighSchoolSelect, backgroundColor: 'white',isselect: false },
        { id: 3, title: '大学', img: University, selectimg: UniversitySelect, backgroundColor: 'white',isselect: false },
        { id: 4, title: '职场', img: Workplace, selectimg: WorkplaceSelect, backgroundColor: 'white',isselect: false },
      ],
      [
        { id: 1, title: '海外留学', img: Study, selectimg: StudySelect, backgroundColor: 'white',isselect: false },
        { id: 2, title: '工作需求', img: Work, selectimg: WorkSelect, backgroundColor: 'white',isselect: false },
        { id: 3, title: '个人提升', img: Improve, selectimg: ImproveSelect, backgroundColor: 'white',isselect: false },
      ],
      [
        { id: 1, title: '正在补习', img: Tutoring, selectimg: TutoringSelect, backgroundColor: 'white',isselect: false },
        { id: 2, title: '准备补习', img: Tutor, selectimg: TutorSelect, backgroundColor: 'white',isselect: false },
        { id: 3, title: '准备自学', img: Selfstudy, selectimg:SelfstudySelect,backgroundColor: 'white',isselect: false },
      ]
]);

const toggleImage = (groupIndex: number, itemIndex: number) => {
    const group = question.value[groupIndex];
    group.forEach((item, index) => {
        if (index === itemIndex) {
            item.isselect = !item.isselect;
            item.backgroundColor = item.isselect ? '#1B8B8C' : 'white';
        } else {
            item.isselect = false;
            item.backgroundColor = 'white';
        }
    });
};



</script>
  