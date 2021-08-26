import { defineComponent, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import { scrollToTop } from '@idux/cdk/scroll'
import { callEmit } from '@idux/cdk/utils'
import { panelColumnProps } from '../types'
import PanelCell from './PanelCell'

export default defineComponent({
  props: panelColumnProps,
  setup(props) {
    const listRef = ref<HTMLElement | null>(null)

    const onChange = (value: string | number) => {
      callEmit(props.onChange, value)
      nextTick(scrollToSelected)
    }

    const scrollToSelected = (duration = 200) => {
      const target = listRef.value
      if (target) {
        const selectedIndex = props.options.findIndex(item => item.value === props.selectedValue)
        const top = (target.children[selectedIndex] as HTMLElement)?.offsetTop ?? 0

        scrollToTop({ top, target, duration })
      }
    }

    watchEffect(() => {
      if (props.visible) {
        nextTick(() => scrollToSelected(0))
      }
    })

    return () => (
      <ul ref={listRef} class="ix-time-picker-panel-column">
        {props.options.map((item, index) => {
          const { disabled, value } = item
          return (
            <PanelCell
              key={index}
              disabled={disabled}
              selected={props.selectedValue === value}
              value={value}
              onChange={onChange}
            />
          )
        })}
      </ul>
    )
  },
})
