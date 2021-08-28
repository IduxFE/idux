/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResizeObserver } from '@juggle/resize-observer'
import { isString } from 'lodash-es'

type ElType = HTMLElement | Document | Window

export function on<K extends keyof HTMLElementEventMap>(
  el: ElType | undefined,
  type: K | undefined,
  listener: ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any) | undefined,
  options?: boolean | AddEventListenerOptions,
): void
export function on(
  el: ElType | undefined,
  type: string | undefined,
  listener: EventListenerOrEventListenerObject | undefined,
  options?: boolean | AddEventListenerOptions,
): void
export function on(
  el: ElType | undefined,
  type: string | undefined,
  listener: EventListenerOrEventListenerObject | undefined,
  options?: boolean | AddEventListenerOptions,
): void {
  if (el && type && listener) {
    el.addEventListener(type, listener, options)
  }
}

export function off<K extends keyof HTMLElementEventMap>(
  el: ElType | undefined,
  type: K | undefined,
  listener: ((this: HTMLElement, ev: HTMLElementEventMap[K]) => any) | undefined,
  options?: boolean | EventListenerOptions,
): void
export function off(
  el: ElType | undefined,
  type: string | undefined,
  listener: EventListenerOrEventListenerObject | undefined,
  options?: boolean | EventListenerOptions,
): void
export function off(
  el: ElType | undefined,
  type: string | undefined,
  listener: EventListenerOrEventListenerObject | undefined,
  options?: boolean | EventListenerOptions,
): void {
  if (el && type && listener) {
    el.removeEventListener(type, listener, options)
  }
}

type ResizeListener = (entry: ResizeObserverEntry) => void

const resizeMap = new Map<Element, { listeners: ResizeListener[]; ro: ResizeObserver }>()

export function onResize(
  el: Element | undefined,
  listener: ResizeListener | undefined,
  options?: ResizeObserverOptions,
): void {
  if (!el || !listener) {
    return
  }

  if (resizeMap.has(el)) {
    resizeMap.get(el)!.listeners.push(listener)
  } else {
    const listeners = [listener]
    const ro = new ResizeObserver(entries => {
      entries.forEach(entry => listeners.forEach(fn => fn(entry)))
    })
    ro.observe(el, options)
    resizeMap.set(el, { listeners, ro })
  }
}

export function offResize(el: Element | undefined, listener: ResizeListener | undefined): void {
  if (!el || !listener || !resizeMap.has(el)) {
    return
  }

  const { listeners, ro } = resizeMap.get(el)!
  const listenerIndex = listeners.indexOf(listener)
  if (listenerIndex > -1) {
    listeners.splice(listenerIndex, 1)
    if (listeners.length === 0) {
      ro.disconnect()
      resizeMap.delete(el)
    }
  }
}

export function hasClass(el: HTMLElement, className: string): boolean {
  if (!className) {
    return false
  }
  return el.classList.contains(className)
}

export function addClass(el: HTMLElement, className: string | string[]): void {
  const cls: string[] = isString(className) ? [className] : className
  el.classList.add(...cls)
}

export function removeClass(el: HTMLElement, className: string | string[]): void {
  const cls: string[] = isString(className) ? [className] : className
  el.classList.remove(...cls)
}

export const rAF = requestAnimationFrame || (cb => setTimeout(cb, 1000 / 60))

export const cancelRAF = cancelAnimationFrame || clearTimeout

export function throttleRAF<T extends (...args: any[]) => void>(
  fn: T,
): {
  (...args: Parameters<T>): void
  cancel(): void
} {
  let id: number | null = null

  const frameCb = (...args: Parameters<T>) => {
    id = null
    fn(...args)
  }

  const requestCb = (...args: Parameters<T>): void => {
    if (id === null) {
      id = rAF(() => frameCb(...args))
    }
  }

  requestCb.cancel = () => {
    if (id !== null) {
      ;(cancelAnimationFrame || clearTimeout)(id)
    }
  }

  return requestCb
}

export const noop = (): void => {}

function isStyleVisible(element: HTMLElement | SVGElement) {
  const { display, visibility, opacity } = getComputedStyle(element)

  return display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse' && opacity !== '0'
}

function isAttributeVisible(element: HTMLElement | SVGElement) {
  let box: DOMRect | undefined
  if (element instanceof HTMLElement) {
    if (element.offsetParent) {
      return true
    }
    box = element.getBoundingClientRect()
  } else if ((element as SVGGraphicsElement).getBBox) {
    box = (element as SVGGraphicsElement).getBBox()
  }

  if (box && box.width && box.height) {
    return true
  }
  return false
}

export function isVisibleElement(element: HTMLElement | SVGElement | undefined): boolean {
  if (!element) {
    return false
  }

  return isStyleVisible(element) && isAttributeVisible(element)
}
