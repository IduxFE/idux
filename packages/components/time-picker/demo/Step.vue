<template>
  <section>
    <time-picker v-model:value="time" :hour-step="2" :minute-step="5" :second-step="10" />
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
    const time = ref(new Date())

    return {
      time,
    }
  },
})
</script>
<style lang="less" scoped>
.ix-time-picker {
  margin: 0 10px 10px 0;
}
</style>
