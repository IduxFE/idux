import type { Slots, VNode } from 'vue'

export function renderFooter(slots: Slots): VNode | null {
  if (!slots.footer) {
    return null
  }
  return <div class="ix-table-footer">{slots.footer()}</div>
}
