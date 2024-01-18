import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {request_login} from "@/service/login"
export const useUserStore = defineStore('user', () => {
  const getCodeCountdown = ref(60)
  const doubleCount = computed(() => count.value * 2)
  function login() {
    request_login()
  }
  function getCode(phoneNumber:string) {
    if(phoneNumber){
      console.log(phoneNumber)
    }
  }

  return { getCodeCountdown, doubleCount, login, getCode }
})
