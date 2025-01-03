### IxButton

#### ButtonProps

> 当 `mode` 不为 `link` 时，除以下表格之外还支持原生 `button` 元素的[所有属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button)。  
> 当 `mode` 为 `link` 时，除以下表格之外还支持原生 `a` 元素的[所有属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)。

| 名称 | 说明 | 类型  | 默认值 | 全局配置 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `block` | 将按钮宽度调整为自适应其父元素的宽度 | `boolean` | - | - |- |
| `danger` | 设置危险状态 | `boolean` | - | - |- |
| `disabled` | 设置禁用状态 | `boolean` | - | - |- |
| `ghost` | 设置幽灵状态 | `boolean` | - | - |- |
| `icon` | 设置图标类型 | `string` | - | - | `loading` 为 `true` 时无效 |
| `iconPosition` | 设置图标位置 | `'start' \| 'end'` | `'start'` | - | - |
| `loading` | 设置加载中状态 | `boolean` |  - | - |- |
| `mode` | 设置按钮种类 | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` | - |- |
| `shape` | 设置按钮形状 | `'square' \| 'circle' \| 'round'` | - | - |- |
| `size` | 设置按钮大小 | `'xl' \| 'lg' \| 'md' \| 'sm' \| 'xs'` | `'md'` | ✅ | `seer` 主题下默认为 `'sm'` |
| `type` | 原生 `button` 的 `type` 属性 | `'button' \| 'submit' \| 'reset'` | `'button'` | - | 参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type) |
| `waveless` | 是否关闭按钮点击时波纹动画 | `boolean` | `false` | ✅ | 不支持`link`和`text`模式，且存在[浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7) |

#### ButtonSlots

| 名称 | 说明 | 参数类型 | 备注 |
| --- | --- | --- | --- |
| `icon` | 自定义图标 | - | - |

### IxButtonGroup

#### ButtonGroupProps

> 除以下表格之外还支持 `Space` 组件的[所有属性](/components/space/zh?tab=api#SpaceProps)。

| 名称 | 说明 | 类型  | 默认值 | 全局配置 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `align` | 设置对齐方式, `align-items` | `'start' \| 'center' \| 'end' \| 'baseline' \| 'stretch'` | `'center'` | - | 参见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) |
| `block` | 将按钮宽度调整为自适应其父元素的宽度 | `boolean` | - | - |- |
| `danger` | 设置按钮组危险状态 | `boolean` | - | - |- |
| `disabled` | 设置按钮组禁用状态 | `boolean` | - | - |- |
| `gap` | 设置按钮组的 gap 配置 | `number \| string` | `0` | - | 也就是 `Space` 的 `size` |
| `ghost` | 设置按钮组为幽灵状态 | `boolean` | - | - |- |
| `mode` | 设置组内按钮种类 | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | - | - |- |
| `shape` | 设置组内按钮形状 | `'circle' \| 'round'` | - | - |- |
| `size` | 设置组内按钮大小 | `'lg' \| 'md' \| 'sm'` | - | - |- |
