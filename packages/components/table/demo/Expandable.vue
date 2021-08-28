<template>
  <IxTable v-model:expandedRowKeys="expandedRowKeys" :columns="columns" :dataSource="data">
    <template #name="{ value }">
      <a>{{ value }}</a>
    </template>
    <template #expand="{ record }">
      <span> {{ record.description }}</span>
    </template>
  </IxTable>
</template>

<script lang="ts" setup>
import { TableColumn } from '@idux/components/table'
import { ref } from '@vue/reactivity'

interface Data {
  id: number
  name: string
  age: number
  address: string
  description?: string
}

const expandedRowKeys = ref([1])

const columns: TableColumn<Data>[] = [
  {
    type: 'expandable',
    disabled: record => !record.description,
    onChange: expendedRowKeys => console.log(expendedRowKeys),
    customExpand: 'expand',
  },
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
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    id: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
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
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
]
</script>
