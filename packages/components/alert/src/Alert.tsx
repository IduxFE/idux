/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { Transition, computed, defineComponent, normalizeClass, watch } from 'vue'

import { isNil, isObject } from 'lodash-es'

import { callEmit, convertArray, flattenNode, useState } from '@idux/cdk/utils'
import { useGlobalConfig } from '@idux/components/config'
import { IxIcon } from '@idux/components/icon'
import { IxPagination } from '@idux/components/pagination'
import { useThemeToken } from '@idux/components/theme'
import { convertStringVNode } from '@idux/components/utils'

import { useCloseable } from './composables/useCloseable'
import { alertProps } from './types'
import { getThemeTokens } from '../theme'

export default defineComponent({
  name: 'IxAlert',
  props: alertProps,
  setup(props, { slots }) {
    const common = useGlobalConfig('common')
    const { globalHashId, hashId, registerToken } = useThemeToken('alert')
    registerToken(getThemeTokens)

    const mergedPrefixCls = computed(() => `${common.prefixCls}-alert`)

    const config = useGlobalConfig('alert')
    const [pageIndex, setPageIndex] = useState(1)
    const mergedIcon = computed(() => {
      if (props.icon !== undefined) {
        return props.icon
      }
      const iconConfig = config.icon
      return isObject(iconConfig) ? iconConfig[props.type] : iconConfig
    })
    const { closeable, visible, handleClose } = useCloseable(props, config)

    const handlePageChange = (index: number) => {
      setPageIndex(index)
    }

    watch(
      () => props.pagination,
      pagination => {
        if (isObject(pagination) && !isNil(pagination.pageIndex)) {
          setPageIndex(pagination.pageIndex)
        }
      },
      {
        deep: true,
        immediate: true,
      },
    )

    watch(pageIndex, index => {
      const { pagination } = props
      isObject(pagination) && callEmit(pagination.onChange, index)
    })

    const classes = computed(() => {
      const prefixCls = mergedPrefixCls.value
      return normalizeClass({
        [globalHashId.value]: !!globalHashId.value,
        [hashId.value]: !!hashId.value,
        [prefixCls]: true,
        [`${prefixCls}-${props.type}`]: true,
        [`${prefixCls}-banner`]: props.banner,
        [`${prefixCls}-centered`]: props.centered || config.centered,
        [`${prefixCls}-with-description`]: slots.description || props.description,
      })
    })

    const handleAfterLeave = () => callEmit(props.onAfterClose)

    return () => {
      const { title, pagination } = props

      // TODO: TransitionGroup with pagination
      const titleChildren = slots.default ? flattenNode(slots.default()) : convertArray(title)
      const isPagination = pagination && titleChildren.length > 1
      const titleNodes = isPagination ? titleChildren[pageIndex.value - 1] : titleChildren

      const iconNode = slots.icon ? slots.icon() : mergedIcon.value && <IxIcon name={mergedIcon.value} />
      const descriptionNode = convertStringVNode(slots, props, 'description')

      const prefixCls = mergedPrefixCls.value
      return (
        <Transition name={prefixCls} onAfterLeave={handleAfterLeave}>
          {visible.value && (
            <div class={classes.value}>
              {iconNode && <span class={`${prefixCls}-icon`}>{iconNode}</span>}
              <div class={`${prefixCls}-content`}>
                <div class={`${prefixCls}-title`}>{titleNodes}</div>
                {descriptionNode && <div class={`${prefixCls}-description`}>{descriptionNode}</div>}
              </div>
              {isPagination && (
                <IxPagination
                  class={`${prefixCls}-pagination`}
                  total={titleChildren.length}
                  simple
                  pageIndex={pageIndex.value}
                  showTotal={false}
                  showQuickJumper={false}
                  pageSize={1}
                  onChange={handlePageChange}
                />
              )}
              {closeable.value && (
                <span class={`${prefixCls}-close-icon`} onClick={handleClose}>
                  {slots.closeIcon ? slots.closeIcon() : <IxIcon name={props.closeIcon} />}
                </span>
              )}
            </div>
          )}
        </Transition>
      )
    }
  },
})
