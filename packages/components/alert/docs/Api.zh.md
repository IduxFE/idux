### IxAlert

#### AlertProps

| 名称 | 说明 | 类型  | 默认值 | 全局配置 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `banner` | 是否用作顶部提示 | `boolean` | `false` | - |- |
| `centered` | 信息提示是否居中 | `boolean` | `false` | ✅ |- |
| `closable` | 信息提示是否可关闭 | `boolean` | `false` | ✅ |- |
| `closeIcon` | 自定义关闭按钮 | `string \| #closeIcon` | `close` | - | - |
| `description` | 辅助性文字介绍 | `string \| #description` | - | - |- |
| `icon` | 自定义图标 | `string \| #icon` | - | ✅ | 若要隐藏图标则传空串 |
| `pagination` | 是否开启分页切换 | `boolean \| AlertPagination` | `false` | - | - |
| `type` | 设置提示类型 | `'success' \| 'info' \| 'warning' \| 'error'` | `'warning'` | - |- |
| `title` | 信息提示内容 | `string \| string[] \| #default` | - | - |- |
| `onBeforeClose` | 关闭提示前会触发的回调函数 | `() => boolean \| Promise<boolean>` | - | - | 返回 `false` 会阻止关闭 |
| `onClose` | 关闭提示会触发的回调函数 | `() => void` | - | - | - |
| `onAfterClose` | 关闭提示后触发的回调函数 | `() => void` | - | - | 动画结束 |

```ts
export interface AlertPagination {
  pageIndex?: number
  onChange?: (pageIndex: number) => void
}
```
