/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { type VNodeChild, h } from 'vue'

import { IxIcon } from '@idux/components/icon'
import { zhCN } from '@idux/components/locales'

import { numFormatter } from './numFormatter'
import { type GlobalConfig } from './types'

const expandIconRenderer = ({ expanded }: { expanded: boolean }): VNodeChild =>
  h(
    'svg',
    {
      viewBox: '0 0 16 16',
      style: {
        width: 'var(--ix-font-size-icon)',
        height: 'var(--ix-font-size-icon)',
      },
    },
    [
      h('rect', {
        x: 1,
        y: 1,
        width: 14,
        height: 14,
        rx: 1,
        style: { fill: 'var(--ix-color-emphasized-container-bg)' },
      }),
      h('rect', { x: 5, y: 7, width: 6, height: 2, rx: 0.2, style: { fill: 'var(--ix-color-icon)' } }),
      !expanded
        ? h('rect', { x: 7, y: 5, width: 2, height: 6, rx: 0.2, style: { fill: 'var(--ix-color-icon)' } })
        : null,
    ],
  )

export const defaultConfig: GlobalConfig = {
  common: {
    prefixCls: 'ix',
    overlayZIndex: 1000,
  },
  locale: zhCN,
  theme: {
    injectThemeStyle: true,
    presetTheme: 'default',
    hashed: true,
  },

  alert: {
    centered: false,
    closable: false,
    icon: {
      success: 'check-circle',
      error: 'exclamation-circle',
      info: 'info-circle',
      warning: 'exclamation-circle',
      offline: 'info-circle',
    },
  },
  anchor: {
    bounds: 5,
    hideLinkBall: false,
  },
  avatar: {
    gap: 4,
    icon: 'user',
    shape: 'circle',
    size: 'md',
  },
  backTop: {
    duration: 450,
    visibilityHeight: 400,
  },
  badge: {
    showZero: false,
    dot: false,
    overflowCount: 99,
  },
  button: {
    size: 'sm',
    waveless: false,
  },
  card: {
    borderless: false,
    hoverable: false,
    size: 'sm',
    shadow: true,
  },
  carousel: {
    autoplayTime: 0,
    dotPlacement: 'bottom',
    showArrow: false,
    trigger: 'click',
  },
  cascader: {
    borderless: false,
    clearIcon: 'close-circle',
    childrenKey: 'children',
    expandIcon: 'right',
    fullPath: true,
    getKey: 'key',
    labelKey: 'label',
    overlayMatchWidth: false,
    size: 'md',
    suffix: 'down',
  },
  checkbox: {
    size: 'md',
    waveless: false,
  },
  collapse: {
    accordion: false,
    borderless: false,
    expandIcon: 'right',
    ghost: false,
    size: 'md',
  },
  colorPicker: {
    format: 'hex',
    size: 'md',
  },
  datePicker: {
    allowInput: false,
    borderless: false,
    clearable: false,
    clearIcon: 'close-circle',
    size: 'md',
    suffix: 'calendar',
  },
  desc: {
    col: 3,
    colonless: true,
    labelAlign: 'start',
    layout: 'horizontal',
    size: 'md',
  },
  divider: {
    dashed: false,
    labelPlacement: 'center',
    plain: false,
    size: 'md',
  },
  drawer: {
    closable: true,
    closeOnEsc: true,
    closeIcon: 'close-filled',
    distance: 160,
    height: 256,
    mask: true,
    maskClosable: true,
    width: 480,
  },
  dropdown: {
    autoAdjust: true,
    destroyOnHide: false,
    offset: [0, 4],
    placement: 'bottomStart',
    showArrow: false,
    trigger: 'hover',
  },
  empty: {},
  form: {
    colonless: true,
    labelAlign: 'start',
    layout: 'horizontal',
    size: 'md',
    labelTooltipIcon: 'question-circle',
    controlTooltipIcon: 'info-circle',
  },
  icon: {},
  input: {
    borderless: false,
    clearable: false,
    clearIcon: 'close-circle',
    size: 'md',
    trim: false,
  },
  inputNumber: {
    keyboard: true,
    size: 'md',
  },
  list: {
    size: 'md',
    borderless: true,
  },
  loadingBar: {
    mask: false,
    animation: {
      loading: {
        duration: 3000,
        progress: 80,
      },
      finish: {
        duration: 300,
        progress: 100,
      },
      error: {
        duration: 400,
        progress: 100,
      },
    },
  },
  image: {
    preview: true,
  },
  imageViewer: {
    draggable: true,
    loop: true,
    maskClosable: true,
    zoom: [0.5, 2],
  },
  menu: {
    getKey: 'key',
    indent: 16,
    offset: [0, 4],
    suffix: 'right',
    theme: 'light',
  },
  message: {
    destroyOnHover: false,
    duration: 3000,
    maxCount: 5,
    icon: {
      success: 'check-circle-filled',
      error: 'close-circle-filled',
      info: 'info-circle-filled',
      warning: 'exclamation-circle-filled',
      loading: 'loading',
    },
  },
  modal: {
    animatable: true,
    centered: true,
    closable: true,
    closeIcon: 'close-filled',
    closeOnEsc: true,
    mask: true,
    maskClosable: false,
    spinWithFullModal: false,
  },
  notification: {
    destroyOnHover: false,
    duration: 4500,
    maxCount: 5,
    offset: 24,
    placement: 'topEnd',
  },
  pagination: {
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: false,
    showSizeChanger: false,
    showTitle: true,
    showTotal: true,
    simple: false,
    size: 'sm',
  },
  popconfirm: {
    autoAdjust: true,
    delay: 100,
    destroyOnHide: false,
    placement: 'bottomStart',
    showArrow: true,
    trigger: 'click',
    offset: [0, 4],
  },
  popover: {
    autoAdjust: true,
    delay: 100,
    destroyOnHide: false,
    placement: 'bottomStart',
    showArrow: true,
    trigger: 'hover',
    closeIcon: 'close',
    offset: [0, 4],
  },
  progress: {
    strokeLinecap: 'square',
    size: 'md',
    format: (percent: number) => percent + '%',
    icon: {
      success: 'check',
      exception: 'close',
    },
  },
  radio: {
    size: 'md',
    waveless: false,
  },
  rate: {
    allowHalf: false,
    clearable: false,
    count: 5,
    icon: 'star-filled',
    size: 'md',
  },
  result: {
    status: 'info',
  },
  row: {
    wrap: true,
  },
  select: {
    borderless: false,
    childrenKey: 'children',
    getKey: 'key',
    clearIcon: 'close-circle',
    labelKey: 'label',
    offset: [0, 4],
    overlayMatchWidth: true,
    size: 'md',
    suffix: 'down',
  },
  skeleton: {
    animated: true,
  },
  space: {
    size: 8,
    wrap: true,
  },
  spin: {
    tip: '',
    tipAlign: 'vertical',
    size: 'md',
  },
  statistic: {
    precision: 0,
    formatter: numFormatter,
  },
  stepper: {
    clickable: false,
    labelPlacement: 'end',
    size: 'sm',
  },
  switch: {
    size: 'md',
  },
  tabs: {
    size: 'md',
    showAllTabsPanel: true,
  },
  table: {
    autoHeight: false,
    borderless: true,
    childrenKey: 'children',
    getKey: 'key',
    size: 'md',
    scrollToTopOnChange: true,
    insetShadow: true,
    pagination: {
      position: 'bottomEnd',
    },
    columnBase: {
      align: 'start',
      sortable: {
        nextTooltip: false,
        orders: ['ascend', 'descend'],
      },
      filterable: {
        multiple: true,
        footer: true,
      },
    },
    columnExpandable: {
      showLine: true,
      icon: expandIconRenderer,
    },
    columnSelectable: {
      showIndex: false,
    },
    columnIndexable: {
      align: 'center',
      customCell: ({ rowIndex, pageSize, pageIndex }) => (pageIndex - 1) * pageSize + rowIndex + 1,
    },
  },
  tag: {},
  tagGroup: {
    gap: 8,
    wrap: true,
  },
  textarea: {
    autoRows: false,
    clearable: false,
    clearIcon: 'close-circle',
    resize: 'vertical',
    showCount: false,
    size: 'md',
    trim: false,
  },
  text: {
    copyIcon: ({ copied }) =>
      h(IxIcon, { name: !copied ? 'copy' : 'check-circle-filled', style: copied ? { color: '#20CC94' } : undefined }),
  },
  timePicker: {
    borderless: false,
    clearable: true,
    clearIcon: 'close-circle',
    size: 'md',
    suffix: 'clock-circle',
    allowInput: true,
    format: 'HH:mm:ss',
  },
  transfer: {
    getKey: 'key',
    clearable: true,
    clearIcon: 'delete',
    showSelectAll: true,
  },
  tooltip: {
    autoAdjust: true,
    showArrow: true,
    delay: 100,
    destroyOnHide: false,
    offset: [0, 4],
    placement: 'bottomStart',
    trigger: 'hover',
  },
  tour: {
    animatable: true,
    gap: { offset: 4, radius: 2 },
    offset: [0, 4],
    mask: true,
    placement: 'bottomStart',
    showArrow: true,
    scrollIntoViewOptions: true,
    closeOnClick: false,
    closeOnEsc: true,
    closable: true,
  },
  tree: {
    autoHeight: false,
    blocked: false,
    childrenKey: 'children',
    expandIcon: expandIconRenderer,
    draggableIcon: 'holder',
    getKey: 'key',
    labelKey: 'label',
    showLine: false,
  },
  treeSelect: {
    borderless: false,
    childrenKey: 'children',
    clearIcon: 'close-circle',
    labelKey: 'label',
    getKey: 'key',
    offset: [0, 4],
    overlayMatchWidth: true,
    size: 'md',
    suffix: 'down',
  },
  upload: {
    multiple: false,
    dragable: false,
    directory: false,
    name: 'file',
    withCredentials: false,
    requestMethod: 'post',
  },
  uploadFiles: {
    type: 'text',
    icon: {
      preview: 'zoom-in',
      file: 'paper-clip',
      remove: 'close',
      retry: 'edit',
    },
  },
}
