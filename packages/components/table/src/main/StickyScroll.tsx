import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref, StyleValue, watch, watchEffect } from 'vue'
import { getScrollBarSize } from '@idux/cdk/scroll'
import { getOffset, off, on } from '@idux/cdk/utils'
import { tableToken } from '../token'

export default defineComponent({
  setup() {
    const { scrollBodyRef, handleScroll, mergedSticky, stickyScrollLeft } = inject(tableToken)!

    const isShow = ref(false)
    const isActive = ref(false)
    const delta = ref(0)

    const bodyClientWidth = ref(0)
    const bodyScrollWidth = ref(0)
    const scrollBarWidth = computed(() => {
      const clientWidth = bodyClientWidth.value
      const scrollWidth = bodyScrollWidth.value
      return scrollWidth && clientWidth * (clientWidth / scrollWidth)
    })

    watchEffect(() => {
      const scrollBodyElement = scrollBodyRef.value
      if (!scrollBodyElement) {
        return
      }
      if (isShow.value) {
        const { clientWidth, scrollWidth, scrollLeft } = scrollBodyElement
        stickyScrollLeft.value = (scrollLeft / scrollWidth) * clientWidth
        bodyClientWidth.value = clientWidth
        bodyScrollWidth.value = scrollWidth
      }
    })

    const style = computed(() => {
      return {
        height: getScrollBarSize(),
        width: bodyClientWidth.value,
        bottom: mergedSticky.value.offsetScroll,
      }
    })

    const scrollBarClasses = computed(() => {
      return {
        'ix-table-sticky-scroll-bar': true,
        'ix-table-sticky-scroll-bar-active': isActive.value,
      }
    })

    const scrollBarStyle = computed<StyleValue>(() => {
      return {
        width: `${scrollBarWidth.value}px`,
        transform: `translate3d(${stickyScrollLeft.value}px, 0, 0)`,
      }
    })

    const handleMouseUp = () => (isActive.value = false)

    const handleMouseDown = (evt: MouseEvent) => {
      delta.value = evt.pageX - stickyScrollLeft.value
      isActive.value = true
      evt.preventDefault()
    }

    const handleMouseMove = (evt: MouseEvent) => {
      if (!isActive.value) {
        return
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
      const { buttons } = evt || window?.event
      if (buttons === 0) {
        // If out body mouse up, we can set isActive false when mouse move
        isActive.value = false
        return
      }

      let left = evt.pageX - delta.value

      if (left <= 0) {
        left = 0
      }

      const clientWidth = bodyClientWidth.value
      const scrollWidth = bodyScrollWidth.value
      const barWidth = scrollBarWidth.value
      if (left + barWidth >= clientWidth) {
        left = clientWidth - barWidth
      }
      const scrollLeft = (left / clientWidth) * (scrollWidth + 2)
      handleScroll({ scrollLeft })
    }

    const handleContainerScroll = () => {
      const scrollBodyElement = scrollBodyRef.value!
      const offsetTop = getOffset(scrollBodyElement).top
      const offsetBottom = offsetTop + scrollBodyElement.offsetHeight
      const { container, offsetScroll } = mergedSticky.value
      const offsetClient =
        container === window
          ? document.documentElement.scrollTop + window.innerHeight
          : getOffset(container as HTMLElement).top + (container as HTMLElement).clientHeight

      if (offsetBottom - getScrollBarSize() <= offsetClient || offsetTop >= offsetClient - offsetScroll) {
        isShow.value = false
      } else {
        isShow.value = true
      }
    }

    onMounted(() => {
      on(document.body, 'mouseup', handleMouseUp)
      on(document.body, 'mousemove', handleMouseMove)
      on(window, 'resize', handleContainerScroll)
      watch(
        () => mergedSticky.value.container,
        (currContainer, oldContainer) => {
          off(oldContainer, 'scroll', handleContainerScroll)
          on(currContainer, 'scroll', handleContainerScroll)
        },
        { immediate: true },
      )

      handleContainerScroll()
    })

    onBeforeUnmount(() => {
      off(document.body, 'mouseup', handleMouseUp)
      off(document.body, 'mousemove', handleMouseMove)
      off(window, 'resize', handleContainerScroll)
      off(mergedSticky.value.container, 'scroll', handleContainerScroll)
    })

    return () => {
      if (
        !scrollBodyRef.value ||
        !isShow.value ||
        bodyScrollWidth.value <= bodyClientWidth.value ||
        !scrollBarWidth.value
      ) {
        return null
      }

      return (
        <div class="ix-table-sticky-scroll" style={style.value}>
          <div class={scrollBarClasses.value} style={scrollBarStyle.value} onMousedown={handleMouseDown} />
        </div>
      )
    }
  },
})
