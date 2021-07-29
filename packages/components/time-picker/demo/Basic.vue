<template>
  <section>
    <time-picker v-model:value="time" v-model:open="open"></time-picker>
    <ix-button @click="changeToNow">now</ix-button>
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
    function changeToNow() {
      time.value = new Date()
    }

    const time = ref()
    const open = ref(false)

    return {
      changeToNow,
      open,
      time,
    }
  },
})
</script>
<style lang="less" scoped>
.ix-time-picker {
  margin-right: 10px;
}
</style>
