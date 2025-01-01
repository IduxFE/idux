import { MountingOptions, mount } from '@vue/test-utils'
import { h } from 'vue'

import { renderWork } from '@tests'

import IxAlert from '../src/Alert'
import { AlertProps } from '../src/types'

describe('Alert', () => {
  const AlertMount = (options?: MountingOptions<Partial<AlertProps>>) => mount(IxAlert, { ...options })

  renderWork(IxAlert)

  test('props type work', async () => {
    const wrapper = AlertMount({ props: { type: 'success' } })

    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-success')

    await wrapper.setProps({ type: 'warning' })
    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-warning')

    await wrapper.setProps({ type: 'error' })
    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-error')

    await wrapper.setProps({ type: 'info' })
    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-info')

    await wrapper.setProps({ type: 'offline' })
    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-offline')
  })

  test('props banner work', async () => {
    const wrapper = AlertMount({ props: { banner: true } })

    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-banner')
  })

  test('props centered work', async () => {
    const wrapper = AlertMount({ props: { centered: true } })

    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-centered')
  })

  test('props icon work', async () => {
    const wrapper = AlertMount({ props: { icon: 'bug' } })

    expect(wrapper.find('.ix-icon').classes()).toContain('ix-icon-bug')

    await wrapper.setProps({ icon: '' })
    expect(wrapper.find('.ix-icon').exists()).toBeFalsy()
  })

  test('props title description work', async () => {
    const wrapper = AlertMount({ props: { title: 'alert title' } })

    expect(wrapper.find('.ix-alert-content').text()).toContain('alert title')
    expect(wrapper.find('.ix-alert').classes()).not.toContain('ix-alert-with-description')

    await wrapper.setProps({ title: ['title1', 'title2'] })
    expect(wrapper.find('.ix-alert-content').text()).toContain('title1title2')

    await wrapper.setProps({ description: 'alert description' })
    expect(wrapper.find('.ix-alert-content').text()).toContain('alert description')
    expect(wrapper.find('.ix-alert').classes()).toContain('ix-alert-with-description')
  })

  test('props closable work', async () => {
    const onClose = vi.fn()
    const wrapper = AlertMount({ props: { closable: false, onClose } })

    expect(wrapper.find('.ix-alert-close-icon').exists()).toBeFalsy()

    await wrapper.setProps({ closable: true })
    await wrapper.find('.ix-alert-close-icon').trigger('click')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('props onBeforeClose work', async () => {
    const onBeforeClose = vi.fn().mockResolvedValue(false)
    const onClose = vi.fn()
    const wrapper = AlertMount({
      props: {
        closable: true,
        onBeforeClose,
        onClose,
      },
    })

    await wrapper.find('.ix-alert-close-icon').trigger('click')
    expect(onBeforeClose).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(0)

    onBeforeClose.mockReturnValue(true)
    await wrapper.find('.ix-alert-close-icon').trigger('click')
    expect(onBeforeClose).toHaveBeenCalledTimes(2)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('multiple message work', async () => {
    const wrapper = AlertMount({
      slots: {
        default: () => [h('div', 'message1'), h('div', 'message2')],
      },
    })

    expect(wrapper.find('.ix-alert-content').text()).toBe('message1message2')

    await wrapper.setProps({ pagination: true })

    expect(wrapper.find('.ix-alert-content').text()).toBe('message1')
    expect(wrapper.findAll('.ix-pagination-item')[0].classes()).toContain('ix-pagination-item-disabled')
    expect(wrapper.findAll('.ix-pagination-item')[1].classes()).not.toContain('ix-pagination-item-disabled')
    expect(wrapper.findAll('.ix-pagination-item')[2].classes()).not.toContain('ix-pagination-item-disabled')

    await wrapper.trigger('click')
    expect(wrapper.find('.ix-alert-content').text()).toBe('message1')

    await wrapper.findAll('.ix-pagination-item')[2].trigger('click')
    expect(wrapper.find('.ix-alert-content').text()).toBe('message2')

    await wrapper.findAll('.ix-pagination-item')[2].trigger('click')
    expect(wrapper.find('.ix-alert-content').text()).toBe('message2')

    await wrapper.findAll('.ix-pagination-item')[0].trigger('click')
    expect(wrapper.find('.ix-alert-content').text()).toBe('message1')

    const onChange = vi.fn()

    await wrapper.setProps({
      pagination: {
        pageIndex: 2,
        onChange,
      },
    })
    expect(wrapper.find('.ix-alert-content').text()).toBe('message2')

    await wrapper.findAll('.ix-pagination-item')[0].trigger('click')
    expect(onChange).toBeCalledWith(1)
  })
})
