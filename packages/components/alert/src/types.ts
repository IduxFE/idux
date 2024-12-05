/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { ExtractInnerPropTypes, ExtractPublicPropTypes, MaybeArray } from '@idux/cdk/utils'
import type { DefineComponent, HTMLAttributes, PropType } from 'vue'

export const alertProps = {
  banner: { type: Boolean, default: false },
  centered: { type: Boolean, default: undefined },
  closable: { type: Boolean, default: undefined },
  closeIcon: { type: String, default: 'close' },
  description: String,
  icon: String,
  title: [String, Array] as PropType<string | string[]>,
  pagination: {
    type: [Boolean, Object] as PropType<boolean | AlertPagination>,
    default: false,
  },
  type: {
    type: String as PropType<AlertType>,
    default: 'warning',
  },
  onAfterClose: [Function, Array] as PropType<MaybeArray<() => void>>,
  onBeforeClose: [Function, Array] as PropType<MaybeArray<() => void | boolean | Promise<boolean>>>,
  onClose: [Function, Array] as PropType<MaybeArray<() => void>>,
} as const

export type AlertProps = ExtractInnerPropTypes<typeof alertProps>
export type AlertPublicProps = ExtractPublicPropTypes<typeof alertProps>
export type AlertComponent = DefineComponent<Omit<HTMLAttributes, keyof AlertPublicProps> & AlertPublicProps>
export type AlertInstance = InstanceType<DefineComponent<AlertProps>>

export type AlertType = 'success' | 'info' | 'warning' | 'error' | 'offline'
export interface AlertPagination {
  pageIndex?: number
  onChange?: (pageIndex: number) => void
}
