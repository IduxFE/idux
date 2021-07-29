<template>
  <section>
    <time-picker v-model:value="time" size="large" />
    <time-picker v-model:value="time" size="medium" />
    <time-picker v-model:value="time" size="small" />
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
