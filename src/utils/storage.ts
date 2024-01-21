class Storage {
  set(key: string, value: any, date: string | number | undefined = 'permanent') {
    const data = {
      value,
      date
    }
    if (date != 'permanent') {
      const d = (new Date()).valueOf()
      data.date = Number(d) + Number(date)
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  get(key: string) {
    const value = localStorage.getItem(key)
    if (value) {
      const obj = JSON.parse(value)
      const d = (new Date()).valueOf()
      if (obj.date == 'permanent' || obj.date > d) {
        return {
          message: `获取成功`,
          value: obj.value
        }
      } else {
        this.remove(key)
        return {
          message: `您的${key}已过期`,
          value: null
        }
      }
    } else {
      return {
        message: `key值无效`,
        value: null
      }
    }
  }
  remove(key: string) {
    localStorage.removeItem(key)
  }
  clear() {
    localStorage.clear()
  }
}
export default new Storage()
