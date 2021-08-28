import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { offResize, onResize } from '@idux/cdk/utils'
import { tableMeasureCellProps } from '../../types'

export default defineComponent({
  props: tableMeasureCellProps,
  setup(props) {
    const cellRef = ref<HTMLTableCellElement>()

    const handleResize = (evt: ResizeObserverEntry) => {
      const { offsetWidth } = evt.target as HTMLTableCellElement
      props.onCellResize(props.cellKey, offsetWidth)
    }

    onMounted(() => {
      const element = cellRef.value!
      props.onCellResize(props.cellKey, element.offsetWidth)
      onResize(element, handleResize)
    })

    onBeforeUnmount(() => offResize(cellRef.value, handleResize))

    return () => (
      <td ref={cellRef} style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
      </td>
    )
  },
})
