import dayjs from 'dayjs'
import type {DurationUnitType} from "dayjs/plugin/duration";
import duration from 'dayjs/plugin/duration'

export const formatTime = (val:number = 0, unit : DurationUnitType = 'seconds' , format: string = 'mm:ss') => {
  dayjs.extend(duration)
  return dayjs.duration(val, unit).format(format)
}