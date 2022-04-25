/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import { computed, defineComponent, normalizeClass, provide, ref, watch } from 'vue'

import { type VirtualScrollToFn } from '@idux/cdk/scroll'
import { type VKey, callEmit, useControlledProp, useState } from '@idux/cdk/utils'
import { ɵOverlay } from '@idux/components/_private/overlay'
import { ɵSelector, type ɵSelectorInstance } from '@idux/components/_private/selector'
import { useGlobalConfig } from '@idux/components/config'
import { ɵUseOverlayState } from '@idux/components/select'
import { type TreeInstance } from '@idux/components/tree'
import { useFormAccessor } from '@idux/components/utils'

import { useMergeNodes } from './composables/useDataSource'
import { useGetNodeKey } from './composables/useGetNodeKey'
import { useSelectedState } from './composables/useSelectedState'
import Content from './content/Content'
import { treeSelectToken } from './token'
import { type TreeSelectNode, treeSelectProps } from './types'

const defaultOffset: [number, number] = [0, 8]

export default defineComponent({
  name: 'IxTreeSelect',
  inheritAttrs: false,
  props: treeSelectProps,
  setup(props, { attrs, expose, slots }) {
    const common = useGlobalConfig('common')
    const mergedPrefixCls = computed(() => `${common.prefixCls}-tree-select`)
    const config = useGlobalConfig('treeSelect')
    const getNodeKey = useGetNodeKey(props, config)

    const triggerRef = ref<ɵSelectorInstance>()
    const [inputValue, setInputValue] = useState('')
    const focus = () => triggerRef.value?.focus()
    const blur = () => triggerRef.value?.blur()
    const clearInput = () => {
      props.searchable === 'overlay' ? setInputValue('') : triggerRef.value?.clearInput()
    }

    const [expandedKeys, setExpandedKeys] = useControlledProp(props, 'expandedKeys', () => [])

    const accessor = useFormAccessor()
    const { mergedNodeMap } = useMergeNodes(props, getNodeKey, config)
    const { selectedValue, selectedNodes, changeSelected, handleRemove, handleClear } = useSelectedState(
      props,
      accessor,
      mergedNodeMap,
    )
    const { overlayRef, overlayStyle, updateOverlay, overlayOpened, setOverlayOpened } = ɵUseOverlayState(
      props,
      config,
      triggerRef,
    )

    const treeRef = ref<TreeInstance>()
    const scrollTo: VirtualScrollToFn = options => {
      treeRef.value?.scrollTo(options)
    }
    const setExpandAll = (isAll: boolean) => {
      const _expendedKeys: VKey[] = []
      const _expendedNodes: TreeSelectNode[] = []
      if (isAll) {
        mergedNodeMap.value.forEach(node => {
          if (!node.isLeaf) {
            _expendedKeys.push(node.key)
            _expendedNodes.push(node.rawData)
          }
        })
      }
      callEmit(props.onExpandedChange, _expendedKeys, _expendedNodes)
      setExpandedKeys(_expendedKeys)
    }

    expose({ focus, blur, scrollTo, setExpandAll })

    const handleNodeClick = () => {
      if (props.multiple) {
        focus()
        clearInput()
      } else {
        setOverlayOpened(false)
      }
    }

    const handleBlur = () => accessor.markAsBlurred()
    const handleItemRemove = (key: unknown) => {
      focus()
      handleRemove(key)
    }

    provide(treeSelectToken, {
      props,
      slots,
      config,
      mergedPrefixCls,
      getNodeKey,
      expandedKeys,
      mergedNodeMap,
      inputValue,
      setInputValue,
      treeRef,
      accessor,
      setExpandedKeys,
      setExpandAll,
      overlayOpened,
      setOverlayOpened,
      handleNodeClick,
      selectedValue,
      changeSelected,
    })

    watch(overlayOpened, opened => {
      opened ? focus() : blur()
      clearInput()
    })

    const overlayClasses = computed(() => {
      const { overlayClassName, multiple } = props
      const prefixCls = mergedPrefixCls.value
      return normalizeClass({
        [`${prefixCls}-overlay`]: true,
        [`${prefixCls}-overlay-multiple`]: multiple,
        [overlayClassName || '']: !!overlayClassName,
      })
    })

    const target = computed(() => props.target ?? config.target ?? `${mergedPrefixCls.value}-overlay-container`)

    const renderTrigger = () => (
      <ɵSelector
        ref={triggerRef}
        v-slots={slots}
        className={mergedPrefixCls.value}
        allowInput={false}
        autocomplete={props.autocomplete}
        autofocus={props.autofocus}
        borderless={props.borderless}
        clearable={props.clearable}
        clearIcon={props.clearIcon}
        config={config}
        dataSource={selectedNodes.value}
        disabled={accessor.disabled.value}
        maxLabel={props.maxLabelCount ?? props.maxLabel}
        multiple={props.multiple}
        opened={overlayOpened.value}
        placeholder={props.placeholder}
        readonly={props.readonly}
        searchable={props.searchable}
        size={props.size}
        suffix={props.suffix}
        value={selectedValue.value}
        onBlur={handleBlur}
        onClear={handleClear}
        onInputValueChange={setInputValue}
        onItemRemove={handleItemRemove}
        //onKeydown={handleKeyDown}
        onOpenedChange={setOverlayOpened}
        onResize={updateOverlay}
        onSearch={props.onSearch}
        {...attrs}
      />
    )

    const renderContent = () => <Content />

    return () => {
      const overlayProps = {
        class: overlayClasses.value,
        style: overlayStyle.value,
        clickOutside: true,
        disabled: accessor.disabled.value || props.readonly,
        offset: defaultOffset,
        placement: 'bottomStart',
        target: target.value,
        trigger: 'manual',
        triggerId: attrs.id,
        visible: overlayOpened.value,
        'onUpdate:visible': setOverlayOpened,
      } as const

      const overlaySlots = { default: renderTrigger, content: renderContent }

      return <ɵOverlay ref={overlayRef} {...overlayProps} v-slots={overlaySlots} />
    }
  },
})
