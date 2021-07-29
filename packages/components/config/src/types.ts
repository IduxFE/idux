import type { VNode } from 'vue'
import type { OverlayPlacement, OverlayTrigger } from '@idux/cdk/overlay'
import type { PopperPlacement, PopperTrigger } from '@idux/cdk/popper'
import type { ButtonSize } from '@idux/components/button'
import type { CardSize } from '@idux/components/card'
import type { DividerPosition, DividerType } from '@idux/components/divider'
import type { FormLabelAlign, FormLayout, FormSize } from '@idux/components/form'
import type { TextareaResize, TextareaAutoRows } from '@idux/components/input'
import type { ListSize } from '@idux/components/list'
import type { MenuTheme } from '@idux/components/menu'
import type { MessageType } from '@idux/components/message'
import type { PaginationItemRenderFn, PaginationSize, PaginationTotalRenderFn } from '@idux/components/pagination'
import type { ProgressSize, ProgressFormat } from '@idux/components/progress'
import type { ResultStatus } from '@idux/components/result'
import type { SpaceSize } from '@idux/components/space'
import type { SpinTipAlignType, SpinSize } from '@idux/components/spin'
import type { StepperSize } from '@idux/components/stepper'
import type { AvatarShape, AvatarSize } from '@idux/components/avatar'
import type { BreakpointKey } from '@idux/cdk/breakpoint'
import type { ModalType } from '@idux/components/modal'
import type {
  TableColumnAlign,
  TableColumnSortOrder,
  TablePaginationPosition,
  TableSize,
} from '@idux/components/table/src/types'

// General

export interface ButtonConfig {
  size: ButtonSize
}

export interface IconConfig {
  loadIconDynamically?: (iconName: string) => Promise<string>
}

export interface TagConfig {
  closable: boolean
  checkAble: boolean
  isRound: boolean
}

// Layout

export interface DividerConfig {
  dashed: boolean
  plain: boolean
  position: DividerPosition
  type: DividerType
}

export interface SpaceConfig {
  size: SpaceSize
  wrap: boolean
}

export interface RowConfig {
  wrap: boolean
}

// Navigation
export interface DropdownConfig {
  placement: OverlayPlacement
  trigger: OverlayTrigger
}

export interface MenuConfig {
  indent: number
  theme: MenuTheme
}

export interface MenuSubConfig {
  suffix: string
  suffixRotates: [number, number]
}

export interface PaginationConfig {
  itemRender?: PaginationItemRenderFn
  lessJumper: boolean
  pageSize: number
  pageSizes: number[]
  showQuickJumper: boolean
  showSizeChanger: boolean
  showTitle: boolean
  showTotal: boolean
  simple: boolean
  size: PaginationSize
  totalRender?: PaginationTotalRenderFn
}

// Data Entry

export interface FormConfig {
  colonless: boolean
  labelAlign: FormLabelAlign
  layout: FormLayout
  size: FormSize
}

export interface InputConfig {
  borderless: boolean
  clearable: boolean
  clearIcon: string
  size: FormSize
}

export interface TextareaConfig {
  autoRows: boolean | TextareaAutoRows
  clearable: boolean
  clearIcon: string
  computeCount?: (value: string) => string
  maxCount?: number | string
  resize: TextareaResize
  size: FormSize
  showCount: boolean
}

export interface RadioConfig {
  size: FormSize
}

export interface RateConfig {
  count: number
  icon: string
  allowHalf: boolean
  allowClear: boolean
}

export interface SelectConfig {
  borderless: boolean
  clearable: boolean
  labelKey: string
  searchable: boolean
  size: FormSize
  suffix?: string
  valueKey: string
}

export interface TimePickerConfig {
  borderless: boolean
  clearable: boolean
  clearIcon: string
  size: FormSize
  suffix: string
}

export interface TimeRangePickerConfig extends TimePickerConfig {
  separator: string
}

// Data Display
export interface AvatarConfig {
  gap: number
  icon: string | VNode
  shape: AvatarShape
  size: AvatarSize | Partial<Record<BreakpointKey, number>>
}

export interface BadgeConfig {
  showZero: boolean
  dot: boolean
  overflowCount: number | string
}

export interface CardConfig {
  size: CardSize
  borderless: boolean
  hoverable: boolean
}

export interface ListConfig {
  size: ListSize
  borderless: boolean
}

export interface CollapseConfig {
  accordion: boolean
}

export interface ImageConfig {
  width: string | number
  height: string | number
  fallback: string
}

export interface NumFormatted {
  value: string

  /** 格式化后的整数部分 */
  int: string

  /** 格式化后的小数部分，带小数点 */
  decimal: string
}
export type NumFormatter = (value: string | number, precision: number) => NumFormatted
export interface StatisticConfig {
  precision: number
  formatter: NumFormatter
}

export interface TableConfig {
  borderless: boolean
  rowKey: string
  size: TableSize

  extra: { icon: string }
  pagination: { position: TablePaginationPosition } & Partial<PaginationConfig>

  columnBase: TableColumnBaseConfig
  columnExpandable: TableColumnExpandableConfig
}

export interface TableColumnBaseConfig {
  align: TableColumnAlign
  sortable: { directions: TableColumnSortOrder[]; showTooltip: boolean }
}

export interface TableColumnExpandableConfig {
  icon: [string, string]
}

export interface TooltipConfig {
  autoAdjust: boolean
  delay: number | [number | null, number | null]
  destroyOnHide: boolean
  placement: PopperPlacement
  target: string | HTMLElement
  trigger: PopperTrigger
}

export interface PopoverConfig {
  autoAdjust: boolean
  delay: number | [number | null, number | null]
  destroyOnHide: boolean
  placement: PopperPlacement
  target: string | HTMLElement
  trigger: PopperTrigger
}

// Feedback
export interface MessageConfig {
  destroyOnHover: boolean
  duration: number
  icon?: Partial<Record<MessageType, string | VNode>>
  maxCount: number
  top?: number | string
}

export interface ModalConfig {
  centered: boolean
  closable: boolean
  closeIcon: string
  closeOnEsc: boolean
  icon?: Partial<Record<ModalType, string | VNode>>
  mask: boolean
  maskClosable: boolean
  width: string | number
  zIndex?: number
}

export interface DrawerConfig {
  closable: boolean
  closeOnEsc: boolean
  mask: boolean
  maskClosable: boolean
  zIndex?: number
  containerClassName?: string
}

export interface ResultConfig {
  status: ResultStatus
}

export interface SpinConfig {
  icon: string
  tip: string
  tipAlign: SpinTipAlignType
  size: SpinSize
}

export interface ProgressConfig {
  size: ProgressSize
  format: ProgressFormat
}

// Stepper

export interface StepperConfig {
  size: StepperSize
}

// Other

export interface BackTopConfig {
  duration: number
  visibilityHeight: number
}
export interface AnchorConfig {
  bounds: number
  hideLinkBall: boolean
}
// --- end ---

export interface GlobalConfig {
  // General
  button: ButtonConfig
  icon: IconConfig
  tag: TagConfig
  // Layout
  divider: DividerConfig
  space: SpaceConfig
  row: RowConfig
  // Navigation
  dropdown: DropdownConfig
  menu: MenuConfig
  menuSub: MenuSubConfig
  pagination: PaginationConfig
  // Data Entry
  form: FormConfig
  input: InputConfig
  textarea: TextareaConfig
  radio: RadioConfig
  rate: RateConfig
  select: SelectConfig
  timePicker: TimePickerConfig
  timeRangePicker: TimeRangePickerConfig
  // Data Display
  avatar: AvatarConfig
  badge: BadgeConfig
  card: CardConfig
  list: ListConfig
  collapse: CollapseConfig
  image: ImageConfig
  statistic: StatisticConfig
  table: TableConfig
  tooltip: TooltipConfig
  popover: PopoverConfig
  stepper: StepperConfig
  // Feedback
  message: MessageConfig
  modal: ModalConfig
  drawer: DrawerConfig
  result: ResultConfig
  spin: SpinConfig
  progress: ProgressConfig
  // Other
  backTop: BackTopConfig
  anchor: AnchorConfig
  // --- end ---
}

export type GlobalConfigKey = keyof GlobalConfig
