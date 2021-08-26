---
category: components
type: 数据录入
title: TimePicker
subtitle: 时间选择器
order: 0
---

时间选择器

## 何时使用

## API

### ix-timePicker

#### TimePickerProps

 | 名称 | 说明 | 类型 | 默认值 | 全局配置 | 备注 |
 | ----- | ------ | ------ | ------- | -------- | ----- |
 | v-model:value | 当前选择的时间 | `Date` | - | - | - |
 | control | 控件控制器 | `string\| AbstractControl` | - | - | 当存在 control 时, 控件将由 AbstractControl 完全控制，此时 value 会失效 |
 | format | 展示的格式 | `string` | `HH:mm:ss` | - | 1. format的格式参考[dayjs](https://dayjs.gitee.io/docs/zh-CN/display/format) <br>2.如果传入的值有小写的`h`，如`hh:mm:ss`、`hh:mm`，会自动在后面加上a，变成`hh:mm:ss a`和`hh:mm a`，代表开启12小时进制<br>3. 会根据format的内容进行选项的展示，如`HH:mm`则不展示秒的选项 |
 | placeholder | 值为空时展示的提示 | `string` | 请选择时间 | - | - |
 | disabled | 禁用全部操作 | `boolean` |`false` | - | - |
 | readonly | 只读状态 |`boolean` |`false` | - | - |
 | clearable | 是否展示清除按钮 |`boolean` |`true` | ✅ | - |
 | autofocus | 自动获取焦点 |`boolean` |`false` | - | - |
 | borderless | 是否为无边框 |`boolean` |`false` | ✅ | - |
 | suffix | 后缀图标 |`string` | `clock-circle` | ✅ | - |
 | clearIcon | 清除按钮图标 |`string` | `close-circle` | ✅ | - |
 | clearText | hover到clearIcon上，显示的title |`string` | clear | ✅ | - |
 | size | 尺寸大小 | `large\| medium\| small` | `medium` | ✅ | - |
 | v-model:open | 是否打开picker |`boolean` |`false` | - | - |
 | disabledHours | 禁用部分小时选项 | `()=>number[]` | ``() => []`` | - | - |
 | disabledMinutes | 禁用部分分钟选项 | `(selectedHour: number)=>number[]` | `() => []` | - | - |
 | disabledSeconds | 禁用部分秒选项 | (selectedHour: number, selectedMinute: number)=>number[] | `() => []` | - | - |
 | hideDisabledOptions | 隐藏禁止选择的options |`boolean` |`false` | - | - |
 | hourStep | 小时选项的间隔 | `number` | `1` | - | - |
 | minuteStep | 分钟选项的间隔 | `number` | `1` | - | - |
 | secondStep | 秒选项的间隔 | `number` | `1` | - | - |
 | defaultOpenValue | 打开面板时默认高亮的值 | `Date` | - | - | 如果value不为空，则高亮value的值 |
 | overlayClassName | 浮层的类名 |`string` | - | - | - |

#### TimePickerMethods

| 名称 | 说明 | 参数类型 | 备注 |
| --- | --- | --- | --- |
| `blur` | 移除焦点 | `(options?: FocusOptions) => void` | - |
| `focus` | 获取焦点 | `() => void` | - |
