import type { TableColumnMerged } from '../composables/useColumns'

import { convertCssPixel } from '@idux/cdk/utils'
import { defineComponent, inject } from 'vue'
import { tableToken } from '../token'

export default defineComponent({
  setup() {
    const { flattedColumns, columnWidths, scrollBarColumn } = inject(tableToken)!
    return () => {
      const columns = flattedColumns.value
      const children = columnWidths.value.map((width, index) => renderCol(columns[index], width))
      if (children.length && scrollBarColumn.value) {
        children.push(renderCol(scrollBarColumn.value as TableColumnMerged))
      }
      return <colgroup>{children}</colgroup>
    }
  },
})

function renderCol(column: TableColumnMerged, width?: number) {
  const className = 'type' in column ? `ix-table-col-${column.type}` : undefined
  const style = width ?? column.width ? { width: convertCssPixel(width) } : undefined
  return <col key={column.key} class={className} style={style}></col>
}
