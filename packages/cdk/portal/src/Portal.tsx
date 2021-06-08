import { computed, defineComponent, ref, Teleport, watch } from 'vue'
import { portalProps } from './types'
import { useContainer } from './useContainer'

export default defineComponent({
  name: 'IxPortal',
  props: portalProps,
  setup(props) {
    const loaded = ref(props.load)
    watch(
      () => props.load,
      load => {
        if (!loaded.value) {
          loaded.value = load
        }
      },
    )
    const to = computed(() => loaded.value && useContainer(props.target))
    return { to }
  },
  render() {
    const { to, disabled, $slots } = this
    if (!to) {
      return null
    }

    return (
      <Teleport to={to} disabled={disabled}>
        {$slots.default?.()}
      </Teleport>
    )
  },
})
