import type { OverlayOptions, OverlayTrigger } from '@idux/cdk/overlay'

import { onMounted, onUpdated, PropType, unref } from 'vue'
import { mount } from '@vue/test-utils'
import { IxButton } from '@idux/components/button'
import { useOverlay } from '../src/useOverlay'

const defaultOverlayOptions: OverlayOptions = {
  placement: 'bottom',
  scrollStrategy: 'reposition',
  trigger: 'click',
  offset: [0, 0],
  hideDelay: 1000,
  showDelay: 1000,
}

describe('useOverlay.ts', () => {
  let options: OverlayOptions
  let timer: (delay?: number) => Promise<void>

  beforeEach(() => {
    options = { ...defaultOverlayOptions }
    timer = (delay = 0) => {
      return new Promise<void>(resolve => {
        setTimeout(resolve, delay)
      })
    }
  })

  test('init work', () => {
    const instance = useOverlay(options)
    expect(instance).toBeDefined()
  })

  test('visible work', async () => {
    const TestComponent = {
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents, visibility, show, hide } = useOverlay(
          options,
        )

        onMounted(initialize)

        const handleClick = () => {
          unref(visibility) ? hide(true) : show(true)
        }

        return { overlayRef, triggerRef, triggerEvents, overlayEvents, handleClick }
      },
      template: `
      <button id="trigger" ref="triggerRef" @click="triggerEvents.onClick">Trigger</button>
      <button id="immediate" @click="handleClick">Immediate Toggle</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }
    const wrapper = mount(TestComponent)
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')

    await wrapper.get('#trigger').trigger('click')
    await timer(1000)
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')

    await wrapper.get('#trigger').trigger('click')
    await timer(1000)
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')

    await wrapper.get('#immediate').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')

    await wrapper.get('#immediate').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')
  })

  test('component trigger work', async () => {
    const TestComponent = {
      components: { IxButton },
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents } = useOverlay({
          ...options,
          showDelay: 0,
          hideDelay: 0,
        })

        onMounted(initialize)

        return { overlayRef, triggerRef, triggerEvents, overlayEvents }
      },
      template: `
      <ix-button id="trigger" ref="triggerRef" @click="triggerEvents.onClick">Trigger</ix-button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }
    const wrapper = mount(TestComponent)
    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')

    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')
  })

  test('destroy work', async () => {
    const TestComponent = {
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents, destroy } = useOverlay({
          ...options,
          showDelay: 0,
          hideDelay: 0,
        })

        onMounted(initialize)

        const handleClick = () => {
          destroy()
        }

        return { overlayRef, triggerRef, triggerEvents, overlayEvents, handleClick }
      },
      template: `
      <button id="trigger" ref="triggerRef" @click="triggerEvents.onClick">Trigger</button>
      <button id="destroy" @click="handleClick">Destroy</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }
    const wrapper = mount(TestComponent)

    await wrapper.get('#destroy').trigger('click')

    // TODO expect
  })

  test('update work', async () => {
    const TestComponent = {
      components: { IxButton },
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents, update } = useOverlay(options)

        onMounted(initialize)

        const handleClick = () => {
          update({ showDelay: 0 })
        }

        return { overlayRef, triggerRef, triggerEvents, overlayEvents, handleClick }
      },
      template: `
      <button id="trigger" ref="triggerRef" @click="triggerEvents.onClick">Trigger</button>
      <button id="update" @click="handleClick">Update</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }
    const wrapper = mount(TestComponent)

    await wrapper.get('#trigger').trigger('click')
    await timer(1000)
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')

    await wrapper.get('#trigger').trigger('click')
    await timer(1000)
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')

    await wrapper.get('#update').trigger('click')
    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')
  })

  test('trigger work', async () => {
    const TestComponent = {
      components: { IxButton },
      props: {
        trigger: {
          type: String as PropType<OverlayTrigger>,
          default: 'click',
        },
      },
      setup(props: { trigger: OverlayTrigger }) {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents, update } = useOverlay({
          ...options,
          showDelay: 0,
          hideDelay: 0,
          trigger: props.trigger,
        })

        onMounted(initialize)

        onUpdated(() => {
          update({ trigger: props.trigger })
        })

        return { overlayRef, triggerRef, triggerEvents, overlayEvents }
      },
      template: `
      <button id="trigger" ref="triggerRef" @focus='triggerEvents.onFocus' @blur='triggerEvents.onBlur' @mouseenter='triggerEvents.onMouseEnter' @mouseleave='triggerEvents.onMouseLeave' @click="triggerEvents.onClick">Trigger</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }

    const wrapper = mount(TestComponent)
    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')
    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')

    await wrapper.get('#overlay').trigger('mouseleave')

    await wrapper.setProps({ trigger: 'focus' })
    await wrapper.get('#trigger').trigger('focus')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')
    await wrapper.get('#trigger').trigger('focus')

    await wrapper.get('#trigger').trigger('blur')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')

    await wrapper.setProps({ trigger: 'hover' })
    await wrapper.get('#trigger').trigger('mouseenter')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')
    await wrapper.get('#trigger').trigger('mouseleave')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')
  })

  test('hover overlay work', async () => {
    const TestComponent = {
      components: { IxButton },
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents } = useOverlay({
          ...options,
          trigger: 'hover',
          visible: true,
          allowEnter: true,
          showDelay: 0,
          hideDelay: 0,
        })

        onMounted(initialize)

        return { overlayRef, triggerRef, triggerEvents, overlayEvents }
      },
      template: `
      <button id="trigger" ref="triggerRef" @mouseenter='triggerEvents.onMouseEnter' @mouseleave='triggerEvents.onMouseLeave'>Trigger</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay</div>
      `,
    }
    const wrapper = mount(TestComponent)
    await wrapper.get('#overlay').trigger('mouseenter')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: block;')

    await wrapper.get('#overlay').trigger('mouseleave')
    expect(wrapper.get('#overlay').attributes('style')).toContain('display: none;')
  })

  test('arrow work', async () => {
    const TestComponent = {
      components: { IxButton },
      setup() {
        const { initialize, overlayRef, triggerRef, triggerEvents, overlayEvents, arrowRef } = useOverlay({
          ...options,
          showDelay: 0,
          showArrow: true,
        })

        onMounted(initialize)

        return { overlayRef, triggerRef, triggerEvents, overlayEvents, arrowRef }
      },
      template: `
      <button id="trigger" ref="triggerRef" @click="triggerEvents.onClick">Trigger</button>
      <div id="overlay" ref="overlayRef" @mouseenter="overlayEvents.onMouseEnter" @mouseleave="overlayEvents.onMouseLeave">Overlay
        <div ref="arrowRef" id='arrow'></div>
      </div>
      `,
    }
    const wrapper = mount(TestComponent)
    await wrapper.get('#trigger').trigger('click')
    expect(wrapper.get('#arrow')).toBeDefined()
  })

  // todo global scroll
})
