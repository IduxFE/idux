import { StickyContext } from './useSticky'
import { computed, onBeforeUnmount, ComputedRef, Ref, ref } from 'vue'
import { TableProps } from '../types'
import { convertCssPixel } from '@idux/cdk/utils'
import { getScrollBarSize } from '@idux/cdk/scroll'

export function useScroll(props: TableProps, { isSticky, stickyScrollLeft }: StickyContext): ScrollContext {
  const { scrollHeadRef, scrollBodyRef, scrollFootRef, handleScroll, pingedStart, pingedEnd } =
    useScrollRef(stickyScrollLeft)

  const scrollX = computed(() => convertCssPixel(props.scroll?.x))
  const scrollY = computed(() => convertCssPixel(props.scroll?.y))
  const scrollHorizontal = computed(() => !!scrollX.value)
  const scrollVertical = computed(() => !!scrollY.value)
  const scrollBarSize = computed(() => getScrollBarSize(scrollBodyRef.value))
  const scrollBarSizeOnFixedHolder = computed(() =>
    isSticky.value ? 0 : scrollVertical.value ? scrollBarSize.value : 0,
  )

  return {
    scrollHeadRef,
    scrollBodyRef,
    scrollFootRef,
    handleScroll,
    pingedStart,
    pingedEnd,
    scrollX,
    scrollY,
    scrollHorizontal,
    scrollVertical,
    scrollBarSize,
    scrollBarSizeOnFixedHolder,
  }
}

export interface ScrollContext {
  scrollHeadRef: Ref<HTMLDivElement | undefined>
  scrollBodyRef: Ref<HTMLDivElement | undefined>
  scrollFootRef: Ref<HTMLDivElement | undefined>
  handleScroll: (options: ScrollOptions) => void
  pingedStart: Ref<boolean>
  pingedEnd: Ref<boolean>
  scrollX: ComputedRef<string>
  scrollY: ComputedRef<string>
  scrollHorizontal: ComputedRef<boolean>
  scrollVertical: ComputedRef<boolean>
  scrollBarSize: ComputedRef<number>
  scrollBarSizeOnFixedHolder: ComputedRef<number>
}

export interface ScrollOptions {
  target?: HTMLDivElement
  scrollLeft?: number
}

function useScrollRef(stickyScrollLeft: Ref<number>) {
  const scrollHeadRef = ref<HTMLDivElement>()
  const scrollBodyRef = ref<HTMLDivElement>()
  const scrollFootRef = ref<HTMLDivElement>()

  const changeStickyScrollLeft = (scrollLeft: number) => {
    const scrollBodyElement = scrollBodyRef.value
    if (!scrollBodyElement) {
      return
    }
    const { clientWidth, scrollWidth } = scrollBodyElement
    stickyScrollLeft.value = (scrollLeft / scrollWidth) * clientWidth || 0
  }

  const pingedStart = ref(false)
  const pingedEnd = ref(false)

  const lockedScrollTargetRef = ref<HTMLDivElement>()

  let timeout: NodeJS.Timeout | undefined

  const clearTimer = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  const lockScrollTarget = (target: HTMLDivElement | undefined) => {
    lockedScrollTargetRef.value = target
    clearTimer()

    timeout = setTimeout(() => {
      lockedScrollTargetRef.value = undefined
      timeout = undefined
    }, 100)
  }

  onBeforeUnmount(() => clearTimer())

  const forceScroll = (scrollLeft: number, target: HTMLDivElement | undefined) => {
    if (!target) {
      return
    }
    if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft
    }
  }

  const handleScroll = ({ target, scrollLeft }: ScrollOptions) => {
    const mergedScrollLeft = scrollLeft ?? target!.scrollLeft

    const lockedTarget = lockedScrollTargetRef.value
    if (!lockedTarget || lockedTarget === target) {
      lockScrollTarget(target)
      forceScroll(mergedScrollLeft, scrollHeadRef.value)
      forceScroll(mergedScrollLeft, scrollBodyRef.value)
      forceScroll(mergedScrollLeft, scrollFootRef.value)
      changeStickyScrollLeft(mergedScrollLeft)
    }

    if (target) {
      const { scrollWidth, clientWidth } = target
      pingedStart.value = mergedScrollLeft > 0
      pingedEnd.value = mergedScrollLeft < scrollWidth - clientWidth
    }
  }

  return {
    scrollHeadRef,
    scrollBodyRef,
    scrollFootRef,
    handleScroll,
    pingedStart,
    pingedEnd,
  }
}
