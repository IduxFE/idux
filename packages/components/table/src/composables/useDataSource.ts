import type { ComputedRef } from 'vue'
import type { Key, TableProps, TablePagination } from '../types'
import type { ExpandableContext } from './useExpandable'
import type { GetRowKey } from './useGetRowKey'

import { computed } from 'vue'

export function useDataSource(
  props: TableProps,
  getRowKey: ComputedRef<GetRowKey>,
  { expandable, expandedRowKeys }: ExpandableContext,
  mergedPagination: ComputedRef<TablePagination | null>,
): DataSourceContext {
  const mergedData = computed(() =>
    props.dataSource.map(record => covertMergeData(record, getRowKey.value, expandable.value?.childrenKey)),
  )
  const mergedMap = computed(() => {
    const map = new Map<Key, MergedData>()
    covertDataMap(mergedData.value, map)
    return map
  })
  // TODO
  const filteredData = computed(() => mergedData.value)
  // TODO
  const sortedData = computed(() => filteredData.value)
  const paginatedData = computed(() => {
    const pagination = mergedPagination.value
    if (pagination === null) {
      return sortedData.value
    } else {
      const pageSize = pagination.pageSize!
      const startIndex = (pagination.pageIndex! - 1) * pageSize
      return sortedData.value.slice(startIndex, startIndex + pageSize)
    }
  })
  const paginatedMap = computed(() => {
    const map = new Map<Key, MergedData>()
    covertDataMap(paginatedData.value, map)
    return map
  })

  const flattedData = computed(() => {
    const expandedKeys = expandedRowKeys.value
    if (expandedKeys.length > 0) {
      const data: FlattedData[] = []
      paginatedData.value.forEach(item => data.push(...flatData(item, 0, expandedKeys)))
      return data
    }
    return paginatedData.value.map(item => ({ ...item, expanded: false, level: 0 }))
  })

  return { filteredData, flattedData, mergedMap, paginatedMap }
}

export interface DataSourceContext {
  filteredData: ComputedRef<MergedData[]>
  flattedData: ComputedRef<FlattedData[]>
  mergedMap: ComputedRef<Map<Key, MergedData>>
  paginatedMap: ComputedRef<Map<Key, MergedData>>
}

export interface MergedData {
  children?: MergedData[]
  parentKey?: Key
  record: unknown
  rowKey: Key
}

export interface FlattedData extends MergedData {
  expanded: boolean
  level: number
}

function covertMergeData(record: unknown, getRowKey: GetRowKey, childrenKey?: string, parentKey?: Key) {
  const rowKey = getRowKey(record)
  const result: MergedData = { record, rowKey, parentKey }

  const subData = childrenKey ? ((record as Record<string, unknown>)[childrenKey] as unknown[]) : false
  if (subData) {
    result.children = subData.map(subRecord => covertMergeData(subRecord, getRowKey, childrenKey, rowKey))
  }
  return result
}

function covertDataMap(mergedData: MergedData[], map: Map<Key, MergedData>) {
  mergedData.forEach(item => {
    const { rowKey, children } = item
    map.set(rowKey, item)
    if (children) {
      covertDataMap(children, map)
    }
  })
}

function flatData(data: MergedData, level: number, expandedRowKeys: Key[]) {
  const { children, parentKey, record, rowKey } = data
  const expanded = expandedRowKeys.includes(rowKey)
  const result: FlattedData[] = [{ children, parentKey, record, rowKey, level, expanded }]

  if (expanded && children) {
    children.forEach(subRecord => result.push(...flatData(subRecord, level + 1, expandedRowKeys)))
  }

  return result
}
