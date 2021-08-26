<template>
  <section>
    <div class="title">disable options</div>
    <div>
      <time-picker
        v-model:value="time"
        format="hh:mm:ss a"
        :hide-disabled-options="hideDisabledOptions"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
      />
      <ix-button @click="hideDisabledOptions = true">hide disabled options</ix-button>
    </div>

    <div class="title">disabled</div>
    <div>
      <time-picker v-model:value="time" :disabled="disabled" />
      <ix-button @click="disabled = !disabled">change disable</ix-button>
    </div>

    <div class="title">readonly</div>
    <div>
      <time-picker v-model:value="time" :readonly="readonly" />
      <ix-button @click="readonly = !readonly">change readonly</ix-button>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import TimePicker from '../src/TimePicker'

export default defineComponent({
  components: {
    TimePicker,
  },
  setup() {
    const time = ref()
    const disabled = ref(true)
    const readonly = ref(true)
    const hideDisabledOptions = ref(false)

    function disabledHours(selectedAmPm: string) {
      return selectedAmPm === 'am' ? [1, 2, 3] : []
    }

    function disabledMinutes(selectedHour: number, selectedAmPm: string) {
      return selectedAmPm === 'pm' && selectedHour === 12 ? [1, 2, 3] : []
    }

    function disabledSeconds(selectedHour: number, selectedMinute: number, selectedAmPm: string) {
      return selectedAmPm === 'pm' && selectedHour === 12 && selectedMinute === 0 ? [1, 2, 3] : []
    }

    return {
      time,
      disabled,
      readonly,
      hideDisabledOptions,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
    }
  },
})
</script>
<style lang="less" scoped>
.ix-time-picker {
  margin: 0 10px 10px 0;
}
.title {
  padding: 10px 0;
}
</style>
