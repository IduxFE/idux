import type { ComputedRef, Slots, StyleValue } from 'vue'
import type { TableBodyColProps } from '../../types'

import { computed, defineComponent, inject } from 'vue'
import { isFunction, isString } from 'lodash-es'
import { convertArray } from '@idux/cdk/utils'
import { tableToken } from '../../token'
import { tableBodyColProps } from '../../types'
import { getColTitle } from '../../utils'

export default defineComponent({
  props: tableBodyColProps,
  setup(props) {
    const { slots, columnOffsets, fixedColumnKeys, isSticky, bodyColTag } = inject(tableToken)!
    const dataValue = useDataValue(props)

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
      const { align, ellipsis, fixed } = props
      const prefixCls = 'ix-table-td'
      return {
        [prefixCls]: true,
        [`${prefixCls}-align-${align}`]: align,
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
      const children = renderChildren(props, slots, dataValue)
      const { ellipsis, colSpan, rowSpan, additional } = props
      const mergedProps = {
        title: getColTitle(ellipsis, children, dataValue.value),
        colSpan: colSpan === 1 ? undefined : colSpan,
        rowSpan: rowSpan === 1 ? undefined : rowSpan,
        class: classes.value,
        style: style.value,
      }

      const BodyColTag = bodyColTag.value as any
      return (
        <BodyColTag {...mergedProps} {...additional}>
          {children}
        </BodyColTag>
      )
    }
  },
})

function useDataValue(props: TableBodyColProps) {
  return computed(() => {
    const { dataKey, record } = props
    const dataKeys = convertArray(dataKey)
    let value = record
    for (let index = 0; index < dataKeys.length; index++) {
      if (!value) {
        break
      }
      const key = dataKeys[index]
      value = value[key]
    }

    return value
  })
}

function renderChildren(props: TableBodyColProps, slots: Slots, dataValue: ComputedRef<any>) {
  let value = dataValue.value
  const { record, customRender, index } = props
  if (isFunction(customRender)) {
    return customRender({ value, record, index })
  } else if (isString(customRender) && slots[customRender]) {
    return slots[customRender]!({ value, record, index })
  }
  return value
}
