/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { type VNodeChild, computed, defineComponent, inject, normalizeClass, ref } from 'vue'

import { callEmit } from '@idux/cdk/utils'
import { ɵWave, type ɵWaveInstance } from '@idux/components/_private/wave'
import { useGlobalConfig } from '@idux/components/config'
import { FORM_TOKEN } from '@idux/components/form'
import { IxIcon } from '@idux/components/icon'
import { useThemeToken } from '@idux/components/theme'

import { buttonToken } from './token'
import { type ButtonGroupProps, buttonProps } from './types'
import { getThemeTokens } from '../theme'

const aProps = ['href', 'target', 'rel', 'download', 'hreflang', 'ping']

export default defineComponent({
  name: 'IxButton',
  props: buttonProps,
  setup(props, { slots, attrs }) {
    const { globalHashId, hashId, registerToken } = useThemeToken('button')
    registerToken(getThemeTokens)

    const common = useGlobalConfig('common')
    const mergedPrefixCls = computed(() => `${common.prefixCls}-button`)
    const config = useGlobalConfig('button')
    const groupProps = inject(buttonToken, {} as ButtonGroupProps)
    const formContext = inject(FORM_TOKEN, null)

    const waveRef = ref<ɵWaveInstance>()

    const mode = computed(() => props.mode ?? groupProps.mode ?? 'default')
    const size = computed(() => props.size ?? groupProps.size ?? formContext?.size.value ?? config.size)
    const mergedWaveless = computed(
      () => mode.value === 'text' || mode.value === 'link' || (props.waveless ?? config.waveless),
    )
    const mergedDisabled = computed(() => props.disabled ?? groupProps.disabled)

    const classes = computed(() => {
      const {
        block = groupProps.block,
        danger = groupProps.danger,
        ghost = groupProps.ghost,
        loading,
        icon,
        iconPosition,
        shape = groupProps.shape,
      } = props
      const prefixCls = mergedPrefixCls.value
      return normalizeClass({
        [globalHashId.value]: !!globalHashId.value,
        [hashId.value]: !!hashId.value,
        [prefixCls]: true,
        [`${prefixCls}-block`]: block,
        [`${prefixCls}-danger`]: danger,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-ghost`]: ghost,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-icon-only`]: !slots.default && (icon || loading || slots.icon),
        [`${prefixCls}-icon-${iconPosition}`]: slots.default && (icon || loading || slots.icon),
        [`${prefixCls}-${mode.value}`]: mode.value,
        [`${prefixCls}-${shape}`]: !!shape,
        [`${prefixCls}-${size.value}`]: true,
      })
    })

    const handleClick = (evt: MouseEvent) => {
      if (mergedDisabled.value || props.loading) {
        evt.preventDefault()
        evt.stopImmediatePropagation()
        return
      }

      if (!mergedWaveless.value && waveRef.value) {
        waveRef.value.play()
      }
      callEmit(props.onClick, evt)
    }

    return () => {
      const { loading, icon, iconPosition, type } = props

      const children: VNodeChild[] = []

      const renderIcon = () => {
        if (loading) {
          return <IxIcon name="loading"></IxIcon>
        }
        if (slots.icon) {
          return slots.icon()
        }
        if (icon) {
          return <IxIcon name={icon}></IxIcon>
        }
        return null
      }

      const nodesArr: VNodeChild[] = [renderIcon(), slots.default ? <span>{slots.default()}</span> : null]

      if (iconPosition === 'start') {
        children.push(...nodesArr)
      } else if (iconPosition === 'end') {
        children.push(...nodesArr.reverse())
      }

      // 只有在 mode = 'link' 且设置了相关的 attrs 时，才渲染成 a 标签
      if (mode.value === 'link' && Object.keys(attrs).some(attr => aProps.includes(attr))) {
        return (
          <a class={classes.value} onClick={handleClick}>
            {children}
          </a>
        )
      }
      return (
        <button class={classes.value} disabled={mergedDisabled.value || loading} type={type} onClick={handleClick}>
          {children}
          {!mergedWaveless.value && <ɵWave ref={waveRef} />}
        </button>
      )
    }
  },
})
