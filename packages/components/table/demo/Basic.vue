<template>
  <IxTable :columns="columns" :dataSource="data">
    <template #name="{ value }">
      <a>{{ value }}</a>
    </template>
    <template #action="{ record }">
      <a style="margin-right: 8px">Invite {{ record.name }}</a>
      <a>Delete</a>
    </template>
  </IxTable>
</template>

<script lang="ts" setup>
import { TableColumn, TableColumnRenderOption } from '@idux/components/table'
import { h } from 'vue'
import { IxTag } from '@idux/components/tag'

interface Data {
  id: number
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: TableColumn<Data>[] = [
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
  {
    title: 'Tags',
    dataKey: 'tags',
    customRender: ({ value }: TableColumnRenderOption<Data['tags'], Data>) =>
      value.map(tag => {
        let color = tag.length > 5 ? 'warning' : 'success'
        if (tag === 'loser') {
          color = 'error'
        }
        return h(IxTag, { color }, { default: () => tag.toUpperCase() })
      }),
  },
  {
    title: 'Action',
    key: 'action',
    customRender: 'action',
  },
]

const data: Data[] = []
for (let index = 0; index < 100; index++) {
  data.push({
    id: index,
    name: `Edrward ${index}`,
    age: 32,
    address: `London Park no. ${index}`,
    tags: ['nice', 'developer'],
  })
}
</script>
