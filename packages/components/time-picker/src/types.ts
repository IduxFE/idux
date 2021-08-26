import type { DefineComponent, HTMLAttributes } from 'vue'
import type { IxInnerPropTypes, IxPublicPropTypes } from '@idux/cdk/utils'
import type { FormSize } from '@idux/components/form'

import dayjs from 'dayjs/esm'

import { controlPropDef } from '@idux/cdk/forms'
import { IxPropTypes } from '@idux/cdk/utils'

const basePanelProps = {
  disabledHours: IxPropTypes.func<(selectedAmPm: string) => number[]>().def(() => []),
  disabledMinutes: IxPropTypes.func<(selectedHour: number, selectedAmPm: string) => number[]>().def(() => []),
  disabledSeconds: IxPropTypes.func<
    (selectedHour: number, selectedMinute: number, selectedAmPm: string) => number[]
  >().def(() => []),

  hideDisabledOptions: IxPropTypes.bool.def(false),
  hourStep: IxPropTypes.number.def(1),
  minuteStep: IxPropTypes.number.def(1),
  secondStep: IxPropTypes.number.def(1),
}

export type BasePanelProps = IxInnerPropTypes<typeof basePanelProps>

const basePickerProps = {
  ...basePanelProps,
  // v-model
  open: IxPropTypes.bool.def(false),
  control: controlPropDef,

  autofocus: IxPropTypes.bool,
  borderless: IxPropTypes.bool,
  clearable: IxPropTypes.bool,
  clearIcon: IxPropTypes.string,
  clearText: IxPropTypes.string,
  format: IxPropTypes.string.def('HH:mm:ss'),
  overlayClassName: IxPropTypes.string,
  size: IxPropTypes.oneOf<FormSize>(['large', 'medium', 'small']),
  suffix: IxPropTypes.string,

  // events
  'onUpdate:open': IxPropTypes.emit<(isOpen: boolean) => void>(),
  onClear: IxPropTypes.emit<(evt: MouseEvent) => void>(),
  onFocus: IxPropTypes.emit<(evt: FocusEvent) => void>(),
  onBlur: IxPropTypes.emit<(evt: FocusEvent) => void>(),
}

export const timePickerProps = {
  ...basePickerProps,

  // v-model
  value: IxPropTypes.object<Date>(),

  defaultOpenValue: IxPropTypes.object<Date>().def(() => dayjs().hour(0).minute(0).second(0).toDate()),
  disabled: IxPropTypes.bool.def(false),
  placeholder: IxPropTypes.string.def('请选择时间'),
  readonly: IxPropTypes.bool.def(false),

  // events
  'onUpdate:value': IxPropTypes.emit<(value: Date) => void>(),
  onChange: IxPropTypes.emit<(value: Date) => void>(),
}

export type TimePickerProps = IxInnerPropTypes<typeof timePickerProps>
export type TimePickerPublicProps = IxPublicPropTypes<typeof timePickerProps>
export type TimePickerComponent = DefineComponent<HTMLAttributes & typeof timePickerProps>
export type TimePickerInstance = InstanceType<DefineComponent<TimePickerProps>>

export const timeRangePickerProps = {
  ...basePickerProps,

  // v-model
  value: IxPropTypes.object<[Date, Date]>(),

  defaultOpenValue: IxPropTypes.object<[Date, Date]>(),
  disabled: IxPropTypes.oneOfType([IxPropTypes.bool, IxPropTypes.object<[boolean, boolean]>()]).def(false),
  placeholder: IxPropTypes.array<string>().def(['起始时间', '结束时间']),
  readonly: IxPropTypes.oneOfType([IxPropTypes.bool, IxPropTypes.object<[boolean, boolean]>()]).def(false),
  separator: IxPropTypes.string,

  // events
  'onUpdate:value': IxPropTypes.emit<(value: [Date, Date]) => void>(),
  onChange: IxPropTypes.emit<(value: [Date, Date]) => void>(),
}

export type TimeRangePickerProps = IxInnerPropTypes<typeof timeRangePickerProps>
export type TimeRangePickerPublicProps = IxPublicPropTypes<typeof timeRangePickerProps>
export type TimeRangePickerComponent = DefineComponent<HTMLAttributes & typeof timeRangePickerProps>
export type TimeRangePickerInstance = InstanceType<DefineComponent<TimeRangePickerProps>>

export const timePickerPanelProps = {
  ...basePanelProps,

  value: IxPropTypes.object<Date>(),
  defaultOpenValue: IxPropTypes.object<Date>().def(() => dayjs().hour(0).minute(0).second(0).toDate()),
  visible: IxPropTypes.bool,
  hourEnabled: IxPropTypes.bool.def(true),
  minuteEnabled: IxPropTypes.bool.def(true),
  secondEnabled: IxPropTypes.bool.def(true),
  use12Hours: IxPropTypes.bool.def(false),
  amPmCapital: IxPropTypes.bool.def(true),

  // events
  'onUpdate:value': IxPropTypes.emit<(value: Date) => void>(),
  onChange: IxPropTypes.emit<(value: Date) => void>(),
}

export type TimePickerPanelProps = IxInnerPropTypes<typeof timePickerPanelProps>

export const panelColumnProps = {
  selectedValue: IxPropTypes.oneOfType([IxPropTypes.number, IxPropTypes.string]).isRequired,
  options: IxPropTypes.arrayOf(IxPropTypes.object<PanelCell>()).isRequired,
  visible: IxPropTypes.bool,

  // events
  onChange: IxPropTypes.emit<(value: number | string) => void>(),
}

export type PanelColumnProps = IxInnerPropTypes<typeof panelColumnProps>

export interface PanelCell {
  value: number | string
  disabled: boolean
}

export const panelCellProps = {
  disabled: IxPropTypes.bool.def(false),
  selected: IxPropTypes.bool.def(false),
  value: IxPropTypes.oneOfType([Number, String]).isRequired,

  // events
  onChange: IxPropTypes.emit<(value: number | string) => void>(),
}

export type PanelCellProps = IxInnerPropTypes<typeof panelCellProps>

export type TimePickerPanelColumnType = 'hour' | 'minute' | 'second' | 'AM/PM'
