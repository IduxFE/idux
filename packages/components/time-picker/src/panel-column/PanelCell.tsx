import { defineComponent, computed } from 'vue'
import { isNumeric, callEmit } from '@idux/cdk/utils'
import { panelCellProps } from '../types'

export default defineComponent({
  props: panelCellProps,
  setup(props) {
    const classes = computed(() => {
      return {
        'ix-time-picker-panel-cell': true,
        'ix-time-picker-panel-cell-disabled': props.disabled,
        'ix-time-picker-panel-cell-selected': props.selected,
      }
    })

    const onClick = () => {
      if (!props.disabled && !props.selected) {
        callEmit(props.onChange, props.value)
      }
    }

    const displayValue = computed(() => displayFormat(props.value))

    return () => (
      <li class={classes.value} onClick={onClick}>
        {displayValue.value}
      </li>
    )
  },
})

function displayFormat(val: string | number) {
  return isNumeric(val) ? val.toString().padStart(2, '0') : val
}
