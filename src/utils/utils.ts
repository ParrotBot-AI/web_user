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

