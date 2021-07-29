import type { ComputedRef } from 'vue'
import type { Dayjs } from 'dayjs/esm'
import type { TimePickerPanelColumnType, PanelColumnProps, PanelCell, TimePickerPanelProps } from './types'

import { defineComponent, computed } from 'vue'
import dayjs from 'dayjs/esm'
import { callEmit } from '@idux/cdk/utils'
import PanelColumn from './panel-column/PanelColumn'
import { timePickerPanelProps } from './types'
import { calculateValue, calculateViewHour, normalizeAmPm } from './utils'

export default defineComponent({
  name: 'IxTimePickerPanel',
  props: timePickerPanelProps,
  setup(props) {
    const { hourOptionsProps, minuteOptionsProps, secondOptionsProps, amPmOptionsProps } = useOptions(props)

    const columns = computed(() => {
      const result: PanelColumnProps[] = []
      props.hourEnabled && result.push(hourOptionsProps.value)
      props.minuteEnabled && result.push(minuteOptionsProps.value)
      props.secondEnabled && result.push(secondOptionsProps.value)
      props.use12Hours && result.push(amPmOptionsProps.value)
      return result
    })

    return () => (
      <div class="ix-time-picker-panel">
        {columns.value.map((item, index) => (
          <PanelColumn key={index} {...item} visible={props.visible} />
        ))}
      </div>
    )
  },
})

function useOptions(props: TimePickerPanelProps) {
  const selectedValue = computed(() => dayjs(props.value ?? props.defaultOpenValue))
  const viewHours = computed(() => calculateViewHour(selectedValue.value.hour(), props.use12Hours))
  const ampm = computed(() => normalizeAmPm(selectedValue.value.hour(), props.use12Hours, props.amPmCapital))

  const [onHourChange, onMinuteChange, onSecondChange, onAmPmChange] = generateOnChanges(props, selectedValue)

  const hourOptions = computed(() =>
    generateHourOptions(props.use12Hours, props.hourStep, props.disabledHours(ampm.value), props.hideDisabledOptions),
  )
  const hourOptionsProps = computed(() => ({
    selectedValue: viewHours.value,
    options: hourOptions.value,
    onChange: onHourChange,
  }))

  const minuteOptions = computed(() =>
    generateOptions(
      60,
      props.minuteStep,
      props.disabledMinutes(viewHours.value, ampm.value),
      props.hideDisabledOptions,
    ),
  )
  const minuteOptionsProps = computed(() => ({
    selectedValue: selectedValue.value.minute(),
    options: minuteOptions.value,
    onChange: onMinuteChange,
  }))

  const secondOptions = computed(() =>
    generateOptions(
      60,
      props.secondStep,
      props.disabledSeconds(viewHours.value, selectedValue.value.minute(), ampm.value),
      props.hideDisabledOptions,
    ),
  )
  const secondOptionsProps = computed(() => ({
    selectedValue: selectedValue.value.second(),
    options: secondOptions.value,
    onChange: onSecondChange,
  }))

  const amPmOptions = computed(() => generateAmPmOptions('', props.amPmCapital, props.hideDisabledOptions))
  const amPmOptionsProps = computed(() => ({
    selectedValue: ampm.value,
    options: amPmOptions.value,
    onChange: onAmPmChange,
  }))

  return { hourOptionsProps, minuteOptionsProps, secondOptionsProps, amPmOptionsProps }
}

function generateOnChanges(props: TimePickerPanelProps, selectedValue: ComputedRef<Dayjs>) {
  const genChange = (type: TimePickerPanelColumnType, value: string | number) => {
    const newValue = calculateValue(selectedValue.value, type, props.use12Hours, value)
    callEmit(props['onUpdate:value'], newValue)
    callEmit(props.onChange, newValue)
  }

  const types = ['hour', 'minute', 'second', 'AM/PM'] as const
  return types.map(type => (value: string | number) => genChange(type, value))
}

function generateHourOptions(
  is12Hours: boolean,
  step: number,
  disabledOptions: number[],
  hideDisabledOptions: boolean,
) {
  const options = generateOptions(is12Hours ? 12 : 24, step, disabledOptions, hideDisabledOptions)
  if (is12Hours) {
    // if is12Hours, there is no 0, it should be 12 am or 12 pm
    const zeroOpt = options.find(opt => opt.value === 0)
    zeroOpt && (zeroOpt.value = 12)
  }

  return options
}

function generateOptions(total: number, step: number, disabledOptions: number[], hideDisabledOptions: boolean) {
  const options: PanelCell[] = []
  for (let index = 0; index < total; index += step) {
    const isDisabled = disabledOptions.includes(index)
    if (!isDisabled || !hideDisabledOptions) {
      options.push({
        value: index,
        disabled: isDisabled,
      })
    }
  }
  return options
}

function generateAmPmOptions(disabledOption: string, amPmCapital: boolean, hideDisabledOptions: boolean) {
  disabledOption = disabledOption.toLowerCase()
  return ['am', 'pm']
    .map(item => ({
      disabled: disabledOption === item,
      value: amPmCapital ? item.toUpperCase() : item,
    }))
    .filter(item => !hideDisabledOptions || !item.disabled)
}
