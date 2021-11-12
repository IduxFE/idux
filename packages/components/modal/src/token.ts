/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { ModalBindings, ModalProps, ModalProviderRef } from './types'
import type { CommonConfig, ModalConfig } from '@idux/components/config'
import type { ComputedRef, InjectionKey, Ref, Slots } from 'vue'

export interface ModalContext {
  props: ModalProps
  slots: Slots
  common: CommonConfig
  config: ModalConfig
  mergedPrefixCls: ComputedRef<string>
  visible: ComputedRef<boolean>
  animatedVisible: Ref<boolean | undefined>
  mergedVisible: ComputedRef<boolean>
  cancelLoading: Ref<boolean>
  okLoading: Ref<boolean>
}

export const modalToken: InjectionKey<ModalContext> = Symbol('modalToken')

export const modalProviderToken: InjectionKey<ModalProviderRef> = Symbol('modalProviderToken')

// public token
export const MODAL_TOKEN: InjectionKey<ModalBindings> = Symbol('MODAL_TOKEN')
