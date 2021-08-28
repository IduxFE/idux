import { computed, ComputedRef } from 'vue'
import { TableProps } from '../types'
import { ColumnsContext } from './useColumns'
import { ScrollContext } from './useScroll'

export function useTableLayout(
  props: TableProps,
  { hasEllipsis, hasFixed }: ColumnsContext,
  { scrollVertical, scrollX, scrollHorizontal }: ScrollContext,
  isSticky: ComputedRef<boolean>,
): ComputedRef<'auto' | 'fixed'> {
  return computed(() => {
    if (props.tableLayout) {
      return props.tableLayout
    }
    if (scrollVertical.value && hasFixed.value) {
      return scrollX.value === 'max-content' ? 'auto' : 'fixed'
    }

    if (scrollHorizontal.value || isSticky.value || hasEllipsis.value) {
      return 'fixed'
    }
    return 'auto'
  })
}
