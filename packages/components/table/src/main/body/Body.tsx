import { computed, defineComponent, inject, VNodeTypes } from 'vue'
import { isString } from 'lodash-es'
import { IxEmpty } from '@idux/components/empty'
import { tableToken } from '../../token'
import BodyRow from './BodyRow'
import BodyRowSingle from './BodyRowSingle'
import MeasureRow from './MeasureRow'

export default defineComponent({
  setup() {
    const { props, slots, flattedData, scrollHorizontal, scrollVertical, isSticky, bodyTag } = inject(tableToken)!
    const showMeasure = computed(() => scrollHorizontal.value || scrollVertical.value || isSticky.value)
    return () => {
      let children: VNodeTypes[] = []
      if (slots.alert) {
        const alertNode = slots.alert()
        children.push(<BodyRowSingle>{alertNode}</BodyRowSingle>)
      }
      const data = flattedData.value
      if (data.length > 0) {
        data.forEach((item, index) => {
          const { expanded, level, record, rowKey } = item
          const rowProps = { key: rowKey, expanded, level, record, rowKey, index }
          children.push(<BodyRow {...rowProps} />)
        })
      } else {
        const emptyProps = isString(props.empty) ? { description: props.empty } : props.empty
        children.push(
          <BodyRowSingle>
            <IxEmpty {...emptyProps}></IxEmpty>
          </BodyRowSingle>,
        )
      }

      const BodyTag = bodyTag.value as any
      return (
        <BodyTag class="ix-table-tbody">
          {showMeasure.value ? <MeasureRow></MeasureRow> : null}
          {children}
        </BodyTag>
      )
    }
  },
})
