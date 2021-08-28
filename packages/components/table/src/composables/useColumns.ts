import type { ComputedRef } from 'vue'
import type { Screens } from '@idux/cdk/breakpoint'
import type { TableColumnBaseConfig, TableColumnExpandableConfig, TableConfig } from '@idux/components/config'
import type {
  Key,
  TableColumn,
  TableColumnAlign,
  TableColumnBase,
  TableColumnExpandable,
  TableColumnFixed,
  TableColumnSelectable,
  TableProps,
} from '../types'

import { computed, nextTick, reactive, ref, watchEffect } from 'vue'
import { isNil } from 'lodash-es'
import { useScreens } from '@idux/cdk/breakpoint'
import { convertArray } from '@idux/cdk/utils'

export function useColumns(
  props: TableProps,
  config: TableConfig,
  scrollBarSizeOnFixedHolder: ComputedRef<number>,
): ColumnsContext {
  const screens = useScreens()
  const mergedColumns = computed(() => mergeColumns(props.columns, screens, config.columnBase, config.columnExpandable))
  const flattedColumns = computed(() => flatColumns(mergedColumns.value))
  const hasEllipsis = computed(() => flattedColumns.value.some(column => (column as TableColumnBase).ellipsis))
  const hasFixed = computed(() => flattedColumns.value.some(column => column.fixed))

  const { columnWidths, setColumnWidth } = useColumnWidths(flattedColumns)
  const columnOffsets = useColumnOffsets(flattedColumns, columnWidths)

  const scrollBarColumn = useScrollBarColumn(flattedColumns, scrollBarSizeOnFixedHolder)
  const mergedRows = computed(() => mergeRows(mergedColumns.value, scrollBarColumn.value))
  const fixedColumnKeys = useFixedColumnKeys(flattedColumns, scrollBarColumn)

  return {
    flattedColumns,
    hasEllipsis,
    hasFixed,
    columnWidths,
    setColumnWidth,
    columnOffsets,
    scrollBarColumn,
    mergedRows,
    fixedColumnKeys,
  }
}

export interface ColumnsContext {
  flattedColumns: ComputedRef<TableColumnMerged[]>
  hasEllipsis: ComputedRef<boolean>
  hasFixed: ComputedRef<boolean>
  columnWidths: ComputedRef<number[]>
  setColumnWidth: (key: Key, width: number) => void
  columnOffsets: ComputedRef<{ starts: number[]; ends: number[] }>
  scrollBarColumn: ComputedRef<TableColumnScrollBar | undefined>
  mergedRows: ComputedRef<TableColumnMergedExtra[][]>
  fixedColumnKeys: ComputedRef<{
    firstStartKey: Key | undefined
    lastStartKey: Key | undefined
    firstEndKey: Key | undefined
    lastEndKey: Key | undefined
  }>
}

export type TableColumnMerged =
  | TableColumnMergedBase
  | TableColumnMergedExpandable
  | TableColumnMergedSelectable
  | TableColumnMergedScrollBar
export type TableColumnMergedExtra =
  | TableColumnMergedBaseExtra
  | TableColumnMergedExpandable
  | TableColumnMergedSelectable
  | TableColumnMergedScrollBar

export interface TableColumnMergedBase extends TableColumnBase {
  align: TableColumnAlign
  key: Key
}
export interface TableColumnMergedBaseExtra extends TableColumnMergedBase {
  colStart: number
  colEnd: number
  hasChildren: boolean
  titleColSpan: number
  titleRowSpan?: number
}
export interface TableColumnMergedExpandable extends TableColumnExpandable, TableColumnMergedBaseExtra {
  align: TableColumnAlign
  childrenKey: string
  key: Key
  icon: [string, string]
  titleColSpan: number
}
export interface TableColumnMergedSelectable extends TableColumnSelectable, TableColumnMergedBaseExtra {
  align: TableColumnAlign
  key: Key
  multiple: boolean
  titleColSpan: number
}

export interface TableColumnScrollBar {
  key: 'scroll-bar'
  type: 'scroll-bar'
  fixed: TableColumnFixed | undefined
  width: number
}

export type TableColumnMergedScrollBar = TableColumnMergedBaseExtra & TableColumnScrollBar

function mergeColumns(
  columns: TableColumn[],
  screens: Screens,
  baseConfig: TableColumnBaseConfig,
  expandableConfig: TableColumnExpandableConfig,
  parentKey?: Key,
): TableColumnMerged[] {
  return columns
    .filter(column => !column.responsive || column.responsive.some(key => screens[key]))
    .map((column, index) => covertColumn(column, screens, baseConfig, expandableConfig, `${parentKey}-${index}`))
}

function covertColumn(
  column: TableColumn,
  screens: Screens,
  baseConfig: TableColumnBaseConfig,
  expandableConfig: TableColumnExpandableConfig,
  defaultKey: Key,
): TableColumnMerged {
  const { align = baseConfig.align } = column

  if ('type' in column) {
    if (column.type === 'expandable') {
      const { childrenKey = 'children', icon = expandableConfig.icon } = column
      return { ...column, key: column.type, align, childrenKey, icon }
    } else {
      // The default value for `multiple` is true
      const multiple = column.multiple ?? true
      return { ...column, key: column.type, align, multiple }
    }
  } else {
    const { key, dataKey, sortable, children } = column
    const _key = key ?? (convertArray(dataKey).join('-') || defaultKey)
    const newColumn = { ...column, key: _key, align }
    if (sortable) {
      newColumn.sortable = { ...baseConfig.sortable, ...sortable }
    }
    if (children?.length) {
      newColumn.children = mergeColumns(children, screens, baseConfig, expandableConfig, _key)
    }
    return newColumn
  }
}

function mergeRows(mergedColumns: TableColumnMerged[], scrollBarColumn: TableColumnScrollBar | undefined) {
  const rows: TableColumnMergedExtra[][] = []

  function calculateColSpans(columns: TableColumnMerged[], colIndex: number, rowIndex: number) {
    rows[rowIndex] ??= []

    let colStart = colIndex
    const titleColSpans = columns.map(column => {
      let titleColSpan = column.titleColSpan ?? 1

      let hasChildren = false
      const subColumns = column.children as TableColumnMerged[] | undefined
      if (subColumns?.length) {
        hasChildren = true
        const subColumnSpans = calculateColSpans(subColumns, colStart, rowIndex + 1)
        if (isNil(column.titleColSpan)) {
          titleColSpan = subColumnSpans.reduce((total, count) => total + count)
        }
      }

      const colEnd = colStart + titleColSpan - 1
      rows[rowIndex].push({ ...column, titleColSpan, colStart, colEnd, hasChildren })

      colStart += titleColSpan

      return titleColSpan
    })

    return titleColSpans
  }

  const rootColumns = scrollBarColumn ? [...mergedColumns, scrollBarColumn as TableColumnMerged] : mergedColumns
  calculateColSpans(rootColumns, 0, 0)

  const rowCount = rows.length
  rows.forEach((columns, rowIndex) => {
    columns.forEach(col => {
      if ('hasChildren' in col && col.hasChildren) {
        col.titleRowSpan = rowCount - rowIndex
      }
    })
  })

  return rows
}

function flatColumns(columns: TableColumnMerged[]) {
  const result: TableColumnMerged[] = []
  columns.forEach(column => {
    const { fixed, children: subColumns } = column as TableColumnBase
    if (subColumns?.length) {
      let subFlattedColumns = flatColumns(subColumns as TableColumnMerged[])
      if (fixed) {
        subFlattedColumns = subFlattedColumns.map(item => ({ fixed, ...item }))
      }
      result.push(...subFlattedColumns)
    } else {
      result.push(column)
    }
  })
  return result
}

function useColumnWidths(flattedColumns: ComputedRef<TableColumnMerged[]>) {
  const widthMap = reactive<Record<Key, number>>({})
  const widthString = ref('')

  watchEffect(() => {
    const keys = Object.keys(widthMap)
    const columns = flattedColumns.value
    if (keys.length !== columns.length) {
      return
    }
    widthString.value = columns.map(column => widthMap[column.key]).join('-')
  })

  const columnWidths = computed(() => widthString.value.split('-').map(Number))
  const setColumnWidth = (key: Key, width: number) => {
    nextTick(() => (widthMap[key] = width))
  }

  return { columnWidths, setColumnWidth }
}

function useColumnOffsets(flattedColumns: ComputedRef<TableColumnMerged[]>, columnWidths: ComputedRef<number[]>) {
  return computed(() => {
    const count = flattedColumns.value.length
    const widths = columnWidths.value

    const startOffsets: number[] = []
    const endOffsets: number[] = []

    let startOffset = 0
    let endOffset = 0

    for (let start = 0; start < count; start++) {
      // Start offset
      startOffsets[start] = startOffset
      startOffset += widths[start] || 0

      // End offset
      const end = count - start - 1
      endOffsets[end] = endOffset
      endOffset += widths[end] || 0
    }

    return {
      starts: startOffsets,
      ends: endOffsets,
    }
  })
}

function useScrollBarColumn(
  flattedColumns: ComputedRef<TableColumnMerged[]>,
  scrollBarSizeOnFixedHolder: ComputedRef<number>,
) {
  return computed<TableColumnScrollBar | undefined>(() => {
    const scrollBarSize = scrollBarSizeOnFixedHolder.value
    if (scrollBarSize === 0) {
      return undefined
    }
    const columns = flattedColumns.value
    const lastColumn = columns[columns.length - 1]
    return {
      key: 'scroll-bar',
      type: 'scroll-bar',
      fixed: lastColumn && lastColumn.fixed,
      width: scrollBarSize,
    }
  })
}

function useFixedColumnKeys(
  flattedColumns: ComputedRef<TableColumnMerged[]>,
  scrollBarColumn: ComputedRef<TableColumnScrollBar | undefined>,
) {
  return computed(() => {
    let firstStartKey: Key | undefined
    let lastStartKey: Key | undefined
    let firstEndKey: Key | undefined
    let lastEndKey: Key | undefined
    const barColumn = scrollBarColumn.value
    const columns = barColumn ? [...flattedColumns.value, barColumn] : flattedColumns.value
    columns.forEach(column => {
      const { fixed, key } = column
      if (fixed === 'start') {
        if (!firstStartKey) {
          firstStartKey = key
        } else {
          lastStartKey = key
        }
      } else if (fixed === 'end') {
        if (!firstEndKey) {
          firstEndKey = key
        } else {
          lastEndKey = key
        }
      }
    })

    return { firstStartKey, lastStartKey, firstEndKey, lastEndKey }
  })
}
