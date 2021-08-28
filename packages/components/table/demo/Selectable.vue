<template>
  <IxSwitch v-model:checked="selectableColumn.multiple" checkedChildren="多选" unCheckedChildren="单选"></IxSwitch>
  <br />
  <IxTable v-model:selectedRowKeys="selectedRowKeys" :columns="columns" :dataSource="data">
    <template #name="{ value }">
      <a>{{ value }}</a>
    </template>
  </IxTable>
</template>

<script lang="ts" setup>
import { TableColumn } from '@idux/components/table'
import { reactive, ref } from '@vue/reactivity'
import { TableColumnSelectable } from '../src/types'

interface Data {
  id: number
  name: string
  age: number
  address: string
}

const selectedRowKeys = ref([1])

const selectableColumn = reactive<TableColumnSelectable<Data>>({
  type: 'selectable',
  disabled: record => record.id === 4,
  multiple: true,
  onChange: (selectedKeys, selectedRows) => console.log(selectedRows),
})

const columns: TableColumn<Data>[] = [
  selectableColumn,
  {
    title: 'Name',
    dataKey: 'name',
    customRender: 'name',
  },
  {
    title: 'Age',
    dataKey: 'age',
  },
  {
    title: 'Address',
    dataKey: 'address',
  },
]

const data: Data[] = [
  {
    id: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    id: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    id: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    id: 4,
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
]
</script>
