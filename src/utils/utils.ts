export const mobileRegex = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2-7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;


export function parse (jsonString = '{}', defaultValue = {}) {
  let result = defaultValue
  try {
    result = JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
  }
  return result
}


export function formatStr (str: string){
  return str.split(/[-_]/).map(val => val.slice(0, 1).toUpperCase() + val.slice(1)).join('')
}

type TimeOfDay = '上午' | '下午' | '晚上';

export function getCurrentTimeOfDay(): TimeOfDay {
  const now = new Date();
  const hours = now.getHours();

  if (hours < 12) {
    return '上午';
  } else if (hours >= 12 && hours < 18) {
    return '下午';
  } else {
    return '晚上';
  }
}

export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor;

  // Check for iOS and Android mobile devices
  if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
    return true; // Mobile Device
  }

  return false; // PC or Other Device
}

export function dely (time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function getRandomSubarray(arr, length) {
  if (length > arr.length) {
    throw new Error("Length cannot be greater than the array length");
  }

  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}