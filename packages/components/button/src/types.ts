/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { ExtractInnerPropTypes, ExtractPublicPropTypes } from '@idux/cdk/utils'
import type { SpaceAlign, SpaceProps } from '@idux/components/space'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, DefineComponent, HTMLAttributes, PropType } from 'vue'

export type ButtonMode = 'primary' | 'default' | 'dashed' | 'text' | 'link'
export type ButtonShape = 'circle' | 'round' | 'square'
export type ButtonSize = 'lg' | 'xl' | 'md' | 'sm' | 'xs'
export type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonIconPosition = 'start' | 'end'

export const buttonProps = {
  block: { type: Boolean, default: undefined },
  danger: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  ghost: { type: Boolean, default: undefined },
  icon: String,
  iconPosition: { type: String as PropType<ButtonIconPosition>, default: 'start' },
  loading: { type: Boolean, default: undefined },
  mode: String as PropType<ButtonMode>,
  size: String as PropType<ButtonSize>,
  shape: String as PropType<ButtonShape>,
  type: { type: String as PropType<ButtonType>, default: 'button' },
  waveless: { type: Boolean, default: undefined },

  onClick: [Function, Array] as PropType<(evt: MouseEvent) => void>,
} as const

export type ButtonProps = ExtractInnerPropTypes<typeof buttonProps>
export type ButtonPublicProps = ExtractPublicPropTypes<typeof buttonProps>
export type ButtonComponent = DefineComponent<
  Omit<ButtonHTMLAttributes | AnchorHTMLAttributes, keyof ButtonPublicProps> & ButtonPublicProps
>
export type ButtonInstance = InstanceType<DefineComponent<ButtonProps>>

export const buttonGroupProps = {
  align: { type: String as PropType<SpaceAlign>, default: 'center' },
  block: { type: Boolean, default: undefined },
  danger: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  gap: { type: [Number, String] as PropType<number | string>, default: 0 },
  ghost: { type: Boolean, default: undefined },
  mode: String as PropType<ButtonMode>,
  size: String as PropType<ButtonSize>,
  shape: String as PropType<ButtonShape>,
} as const

export type ButtonGroupProps = ExtractInnerPropTypes<typeof buttonGroupProps>
export type ButtonGroupPublicProps = ExtractPublicPropTypes<typeof buttonGroupProps> & Omit<SpaceProps, 'size'>
export type ButtonGroupComponent = DefineComponent<
  Omit<HTMLAttributes, keyof ButtonGroupPublicProps> & ButtonGroupPublicProps
>
export type ButtonGroupInstance = InstanceType<DefineComponent<ButtonGroupProps>>
