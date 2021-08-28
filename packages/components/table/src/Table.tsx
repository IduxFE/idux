import type { SpinProps } from '@idux/components/spin'

import { defineComponent, provide } from 'vue'
import { isBoolean } from 'lodash-es'
import { useGlobalConfig } from '@idux/components/config'
import { IxSpin } from '@idux/components/spin'
import { useTags } from './composables/useTags'
import { useColumns } from './composables/useColumns'
import { usePagination } from './composables/usePagination'
import { useExpandable } from './composables/useExpandable'
import { useSelectable } from './composables/useSelectable'
import { useGetRowKey } from './composables/useGetRowKey'
import { useDataSource } from './composables/useDataSource'
import { useScroll } from './composables/useScroll'
import { useTableLayout } from './composables/useTableLayout'
import { useSticky } from './composables/useSticky'
import MainTable from './main/MainTable'
import { renderPagination } from './other/Pagination'
import { renderHeader } from './other/Header'
import { renderFooter } from './other/Footer'
import { tableToken, TABLE_TOKEN } from './token'
import { tableProps } from './types'

export default defineComponent({
  name: 'IxTable',
  props: tableProps,
  setup(props, { slots }) {
    const config = useGlobalConfig('table')
    const tags = useTags(props)
    const getRowKey = useGetRowKey(props, config)
    const stickyContext = useSticky(props)
    const scrollContext = useScroll(props, stickyContext)
    const columnsContext = useColumns(props, config, scrollContext.scrollBarSizeOnFixedHolder)
    const tableLayout = useTableLayout(props, columnsContext, scrollContext, stickyContext.isSticky)
    const { mergedPagination } = usePagination(props, config)
    const expandableContext = useExpandable(props, columnsContext.flattedColumns)
    const dataContext = useDataSource(props, getRowKey, expandableContext, mergedPagination)
    const selectableContext = useSelectable(props, columnsContext.flattedColumns, dataContext)

    const context = {
      props,
      slots,
      config,
      ...tags,
      getRowKey,
      ...columnsContext,
      ...scrollContext,
      ...stickyContext,
      tableLayout,
      mergedPagination,
      ...expandableContext,
      ...dataContext,
      ...selectableContext,
    }

    provide(tableToken, context)
    provide(TABLE_TOKEN, context)

    return () => {
      const header = renderHeader(props, slots)
      const footer = renderFooter(slots)
      const [paginationTop, paginationBottom] = renderPagination(mergedPagination.value, dataContext.filteredData.value)
      const children = [header, paginationTop, <MainTable />, paginationBottom, footer]
      const spinProps = covertSpinProps(props.spin)
      const spinWrapper = spinProps ? <IxSpin {...spinProps}>{children}</IxSpin> : children
      return <div class="ix-table">{spinWrapper}</div>
    }
  },
})

function covertSpinProps(spin: boolean | SpinProps | undefined) {
  return isBoolean(spin) ? { spinning: spin } : spin
}
