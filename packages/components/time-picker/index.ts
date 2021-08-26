import type { TimePickerComponent } from './src/types'

import TimePicker from './src/TimePicker'

const IxTimePicker = TimePicker as unknown as TimePickerComponent

export { IxTimePicker }

export type {
  TimePickerInstance,
  TimePickerPublicProps as TimePickerProps,
  TimeRangePickerInstance,
  TimeRangePickerPublicProps as TimeRangePickerProps,
} from './src/types'
