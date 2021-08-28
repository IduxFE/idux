<template>
  <IxTable :columns="columns" :dataSource="data" :scroll="scroll">
    <template #name="{ value }">
      <a>{{ value }}</a>
    </template>
    <template #action>
      <a>action</a>
    </template>
  </IxTable>
</template>

<script lang="ts" setup>
import { TableColumn, TableScroll } from '@idux/components/table'

interface Data {
  id: number
  name: string
  age: number
  address: string
}

const columns: TableColumn<Data>[] = [
  {
    title: 'Name',
    dataKey: 'name',
    customRender: 'name',
    width: 100,
    fixed: 'start',
  },
  {
    title: 'Age',
    dataKey: 'age',
    width: 100,
    fixed: 'start',
  },
  {
    title: 'Column 1',
    dataKey: 'address',
    width: 150,
    key: 'Column 1',
  },
  {
    title: 'Column 2',
    dataKey: 'address',
    width: 150,
    key: 'Column 2',
  },
  {
    title: 'Column 3',
    dataKey: 'address',
    width: 150,
    key: 'Column 3',
  },
  {
    title: 'Column 4',
    dataKey: 'address',
    width: 150,
    key: 'Column 4',
  },
  {
    title: 'Column 5',
    dataKey: 'address',
    width: 150,
    key: 'Column 5',
  },
  {
    title: 'Column 6',
    dataKey: 'address',
    width: 150,
    key: 'Column 6',
  },
  {
    title: 'Column 7',
    dataKey: 'address',
    width: 150,
    key: 'Column 7',
  },
  {
    title: 'Column 1',
    dataKey: 'address',
    key: 'Column 8',
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'end',
    width: 100,
    customRender: 'action',
  },
]

const data: Data[] = []
for (let i = 0; i < 100; i++) {
  data.push({
    id: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}

const scroll: TableScroll = { x: 1500, y: 300 }
</script>
