import type { Slots, StyleValue, VNodeTypes } from 'vue'
import type { TableHeadColProps } from '../../types'

import { computed, defineComponent, inject } from 'vue'
import { isFunction, isString } from 'lodash-es'
import { tableToken } from '../../token'
import { tableHeadColProps } from '../../types'
import { getColTitle } from '../../utils'

export default defineComponent({
  props: tableHeadColProps,
  setup(props) {
    const { slots, columnOffsets, fixedColumnKeys, isSticky, headColTag } = inject(tableToken)!

    const isFixedFirstStartKey = computed(() => fixedColumnKeys.value.firstStartKey === props.cellKey)
    const isFixedLastStartKey = computed(() => fixedColumnKeys.value.lastStartKey === props.cellKey)
    const isFixedFirstEndKey = computed(() => fixedColumnKeys.value.firstEndKey === props.cellKey)
    const isFixedLastEndKey = computed(() => fixedColumnKeys.value.lastEndKey === props.cellKey)

    const fixedOffset = computed(() => {
      const { fixed } = props
      const { starts, ends } = columnOffsets.value
      if (fixed === 'start') {
        return starts[props.colStart]
      }
      if (fixed === 'end') {
        return ends[props.colEnd]
      }
      return
    })

    const classes = computed(() => {
      const { align, ellipsis, hasChildren, fixed } = props
      const prefixCls = 'ix-table-th'
      return {
        [prefixCls]: true,
        [`${prefixCls}-align-${align}`]: !hasChildren && align,
        [`${prefixCls}-align-center`]: hasChildren,
        [`${prefixCls}-ellipsis`]: ellipsis,
        [`${prefixCls}-fix-start`]: fixed === 'start',
        [`${prefixCls}-fix-start-first`]: isFixedFirstStartKey.value,
        [`${prefixCls}-fix-start-last`]: isFixedLastStartKey.value,
        [`${prefixCls}-fix-end`]: fixed === 'end',
        [`${prefixCls}-fix-end-first`]: isFixedFirstEndKey.value,
        [`${prefixCls}-fix-end-last`]: isFixedLastEndKey.value,
        [`${prefixCls}-fix-sticky`]: fixed && isSticky.value,
      }
    })

    const style = computed<StyleValue>(() => {
      const { fixed } = props
      const offset = fixedOffset.value
      // TODO: use start and end replace left and right
      return {
        position: fixed ? 'sticky' : undefined,
        left: fixed === 'start' ? offset : undefined,
        right: fixed === 'end' ? offset : undefined,
      }
    })

    return () => {
      const { title, ellipsis, colSpan, rowSpan, additional } = props
      let children = renderChildren(props, slots)
      if (ellipsis && (isFixedLastStartKey.value || isFixedFirstEndKey.value)) {
        children = <span class="ix-table-cell-content">{children}</span>
      }
      const mergedProps = {
        title: getColTitle(ellipsis, children!, title),
        colSpan: colSpan === 1 ? undefined : colSpan,
        rowSpan: rowSpan === 1 ? undefined : rowSpan,
        class: classes.value,
        style: style.value,
      }

      const HeadColTag = headColTag.value as any
      return (
        <HeadColTag {...mergedProps} {...additional}>
          {children}
        </HeadColTag>
      )
    }
  },
})

function renderChildren(props: TableHeadColProps, slots: Slots) {
  const { title, customTitle } = props
  let children: VNodeTypes | undefined = title
  if (isFunction(customTitle)) {
    children = customTitle({ title })
  } else if (isString(customTitle) && slots[customTitle]) {
    children = slots[customTitle]!({ title })
  }
  return children
}
