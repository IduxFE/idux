import { defineComponent, inject } from 'vue'
import { useGlobalConfig } from '@idux/components/config'
import { IxIcon } from '@idux/components/icon'
import { TableLocale } from '@idux/components/i18n'
import { TableColumnSortOrder } from '@idux/components/table'
import { IxTooltip } from '@idux/components/tooltip'
import { TABLE_TOKEN } from '../../token'

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  props: ['activeOrderBy', 'sortable'],
  setup(props, { slots }) {
    const { prefixCls } = useGlobalConfig('common')

    const { locale } = inject(TABLE_TOKEN)!

    return () => {
      const { activeOrderBy, sortable } = props
      const { orders, nextTooltip } = sortable
      const title = nextTooltip ? getNextTooltipTitle(locale.value, orders!, activeOrderBy) : undefined
      const sortableNode = (
        <span class={`${prefixCls}-table-sortable`}>
          {slots.default!()}
          {renderSortTrigger(orders!, activeOrderBy)}
        </span>
      )
      return title ? <IxTooltip title={title}>{sortableNode}</IxTooltip> : sortableNode
    }
  },
})

function getNextTooltipTitle(
  locale: TableLocale,
  orders: TableColumnSortOrder[],
  activeOrderBy?: TableColumnSortOrder,
) {
  const nextOrderBy = activeOrderBy ? orders[orders.indexOf(activeOrderBy) + 1] : orders[0]
  const { sortCancel, sortAsc, sortDesc } = locale
  if (!nextOrderBy) {
    return sortCancel
  }
  return nextOrderBy === 'ascend' ? sortAsc : sortDesc
}

function renderSortTrigger(orders: TableColumnSortOrder[], activeOrderBy?: TableColumnSortOrder) {
  const { prefixCls } = useGlobalConfig('common')
  const upNode = orders!.includes('ascend') ? (
    <IxIcon name="caret-up" class={{ [`${prefixCls}-table-sortable-trigger-active`]: activeOrderBy === 'ascend' }} />
  ) : undefined
  const downNode = orders!.includes('descend') ? (
    <IxIcon name="caret-down" class={{ [`${prefixCls}-table-sortable-trigger-active`]: activeOrderBy === 'descend' }} />
  ) : undefined
  return (
    <span class={`${prefixCls}-table-sortable-trigger`}>
      {upNode}
      {downNode}
    </span>
  )
}
