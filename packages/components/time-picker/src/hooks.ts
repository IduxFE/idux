import type { ComputedRef, Ref } from 'vue'
import type { ValueAccessor } from '@idux/cdk/forms'
import type { PopperPlacement, PopperTrigger } from '@idux/cdk/popper'
import type { TimePickerConfig, TimeRangePickerConfig } from '@idux/components/config'
import type { FormSize } from '@idux/components/form'
import type { InputInstance } from '@idux/components/input'
import type { BasePanelProps, TimePickerProps, TimeRangePickerProps } from './types'

import { computed, ref } from 'vue'
import { useValueAccessor } from '@idux/cdk/forms'
import { callEmit } from '@idux/cdk/utils'
import { normalizeFormat } from './utils'

export interface CommonBindings<T> {
  inputRef: Ref<InputInstance | undefined>
  valueAccessor: ValueAccessor<T>
  isDisabled: ComputedRef<boolean>
  handleChange: (value: T) => void
  handleClear: (evt: Event) => void
  handleBlur: (evt: FocusEvent) => void
  focus: (options?: FocusOptions) => void
  blur: () => void
}

export function useCommonBindings<T extends TimePickerProps | TimeRangePickerProps>(
  props: T,
): CommonBindings<T extends TimeRangePickerProps ? [Date, Date] : Date> {
  const inputRef = ref<InputInstance>()
  const valueAccessor = useValueAccessor()
  const isDisabled = computed(() => valueAccessor.disabled)

  const focus = (options?: FocusOptions) => inputRef.value?.focus(options)
  const blur = () => inputRef.value?.blur()

  function handleChange(value: Date | [Date, Date]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callEmit(props.onChange, value as any)
    valueAccessor.setValue(value)
    inputRef.value?.focus()
  }

  function handleClear(evt: Event) {
    callEmit(props.onClear, evt as MouseEvent)
    valueAccessor.setValue?.(null)
  }

  function handleBlur(evt: FocusEvent) {
    callEmit(props.onBlur, evt)
    valueAccessor.markAsBlurred()
  }

  return { inputRef, valueAccessor, isDisabled, handleChange, handleClear, handleBlur, focus, blur }
}

export interface CommonInputProps {
  borderless: boolean
  clearable: boolean
  clearIcon: string
  control: null
  size: FormSize
  suffix: string
}

export function useCommonInputProps(
  props: TimePickerProps | TimeRangePickerProps,
  config: TimePickerConfig | TimeRangePickerConfig,
): ComputedRef<CommonInputProps> {
  return computed(() => {
    return {
      borderless: props.borderless ?? config.borderless,
      clearable: props.clearable ?? config.clearable,
      clearIcon: props.clearIcon ?? config.clearIcon,
      control: null,
      size: props.size ?? config.size,
      suffix: props.suffix ?? config.suffix,
    }
  })
}

export interface CommonPanelProps extends BasePanelProps {
  hourEnabled: boolean
  minuteEnabled: boolean
  secondEnabled: boolean
  use12Hours: boolean
  amPmCapital: boolean
}

export function useCommonPanelProps(props: TimePickerProps | TimeRangePickerProps): ComputedRef<CommonPanelProps> {
  return computed(() => {
    const {
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      format,
      hideDisabledOptions,
      hourStep,
      minuteStep,
      secondStep,
    } = props

    const _format = normalizeFormat(format)

    return {
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      hourStep,
      minuteStep,
      secondStep,
      hourEnabled: /[hH]/.test(_format),
      minuteEnabled: /m/.test(_format),
      secondEnabled: /s/.test(_format),
      use12Hours: /[aA]/.test(_format),
      amPmCapital: /A/.test(_format),
    }
  })
}

export interface CommonOverlayProps {
  class?: string
  clickOutside: boolean
  offset: [number, number]
  placement: PopperPlacement
  showArrow: boolean
  transitionName: string
  trigger: PopperTrigger
}

const defaultOffset: [number, number] = [0, 8]
export function useCommonOverlayProps(props: TimePickerProps | TimeRangePickerProps): ComputedRef<CommonOverlayProps> {
  return computed(() => ({
    class: props.overlayClassName,
    clickOutside: true,
    offset: defaultOffset,
    placement: 'bottom',
    showArrow: false,
    transitionName: 'ix-fade',
    target: 'ix-time-picker-panel-container',
    trigger: 'manual',
  }))
}
