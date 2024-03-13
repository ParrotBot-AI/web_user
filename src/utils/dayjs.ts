import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

export const formatTime = (val:number = 0, unit : string = 'seconds' , format: string = 'mm:ss') => {
  dayjs.extend(duration)
  return dayjs.duration(val, unit).format(format)
}