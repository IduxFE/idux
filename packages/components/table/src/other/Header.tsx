import type { Slots, VNode } from 'vue'
import type { TableProps } from '../types'

import { isString } from 'lodash-es'
import { IxHeader } from '@idux/components/header'

export function renderHeader(props: TableProps, slots: Slots): VNode | VNode[] | null {
  if (slots.header) {
    return slots.header()
  }
  const { size, header } = props
  if (!header) {
    return null
  }

  const headerProps = isString(header) ? { title: header } : header
  return <IxHeader size={size} {...headerProps}></IxHeader>
}
