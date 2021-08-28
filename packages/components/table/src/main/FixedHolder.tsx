import type { Ref, StyleValue } from 'vue'
import type { ScrollOptions } from '../composables/useScroll'

import { computed, defineComponent, inject, onBeforeUnmount, onMounted } from 'vue'
import { off, on } from '@idux/cdk/utils'
import { tableToken } from '../token'
import ColGroup from './ColGroup'

export default defineComponent({
  setup(_, { slots }) {
    const { scrollHeadRef, handleScroll, scrollX, flattedData, isSticky, mergedSticky, columnWidths } =
      inject(tableToken)!

    useScrollEvents(scrollHeadRef, handleScroll)

    const isMaxContent = computed(() => scrollX.value === 'max-content')
    const hasData = computed(() => flattedData.value.length === 0)
    const classes = computed(() => {
      return {
        'ix-table-fixed-holder': true,
        'ix-table-sticky-holder': isSticky.value,
      }
    })
    const style = computed<StyleValue>(() => {
      const sticky = isSticky.value
      const { offsetHead, offsetFoot } = mergedSticky.value
      return {
        overflow: 'hidden',
        top: sticky ? offsetHead : undefined,
        bottom: sticky ? offsetFoot : undefined,
      }
    })

    const tableStyle = computed<StyleValue>(() => {
      const visibility = hasData.value || !columnWidths.value.length ? 'hidden' : undefined
      return {
        tableLayout: 'fixed',
        visibility,
      }
    })

    return () => {
      const children = hasData.value && !isMaxContent.value ? <ColGroup /> : null
      return (
        <div class={classes.value} style={style.value} ref={scrollHeadRef}>
          <table style={tableStyle.value}>
            {children}
            {slots.default?.()}
          </table>
        </div>
      )
    }
  },
})

function useScrollEvents(
  scrollHeadRef: Ref<HTMLDivElement | undefined>,
  handleScroll: (options: ScrollOptions) => void,
) {
  const onWheel = (evt: WheelEvent) => {
    const { currentTarget, deltaX } = evt
    if (deltaX) {
      const target = currentTarget as HTMLDivElement
      handleScroll({ target, scrollLeft: target.scrollLeft + deltaX })
      evt.preventDefault()
    }
  }

  onMounted(() => on(scrollHeadRef.value, 'wheel', onWheel))
  onBeforeUnmount(() => off(scrollHeadRef.value, 'wheel', onWheel))
}
