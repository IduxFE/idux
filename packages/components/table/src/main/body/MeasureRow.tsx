import { defineComponent, inject } from 'vue'

import { tableBodyToken, tableToken } from '../../token'
import MeasureCell from './MeasureCell'

export default defineComponent({
  setup() {
    const { flattedColumns } = inject(tableToken)!
    const { onCellResize } = inject(tableBodyToken)!
    return () => {
      const children = flattedColumns.value.map(column => {
        const { key } = column
        const cellProps = { key, cellKey: key, onCellResize }
        return <MeasureCell {...cellProps}></MeasureCell>
      })
      return (
        <tr class="ix-table-measure-row" style={{ fontSize: 0, height: 0 }} aria-hidden={true}>
          {children}
        </tr>
      )
    }
  },
})
