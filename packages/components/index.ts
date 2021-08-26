import type { App, Directive } from 'vue'

import { version } from '@idux/components/version'

// import General
import { IxButton, IxButtonGroup } from '@idux/components/button'
import { IxIcon } from '@idux/components/icon'
import { IxHeader } from '@idux/components/header'
import { IxTypography } from '@idux/components/typography'
import { IxTag } from '@idux/components/tag'
// import Layout
import { IxDivider } from '@idux/components/divider'
import { IxSpace } from '@idux/components/space'
import { IxRow, IxCol } from '@idux/components/grid'
// import Navigation
import { IxPagination } from '@idux/components/pagination'
import { IxAffix } from '@idux/components/affix'
import { IxDropdown, IxDropdownButton } from '@idux/components/dropdown'
import { IxMenu, IxMenuItem, IxMenuItemGroup, IxMenuDivider, IxMenuSub } from '@idux/components/menu'
// import Data Entry
import { IxForm, IxFormItem, IxFormWrapper } from '@idux/components/form'
import { IxCheckbox, IxCheckboxGroup } from '@idux/components/checkbox'
import { IxInput } from '@idux/components/input'
import { IxRadio, IxRadioGroup } from '@idux/components/radio'
import { IxRate } from '@idux/components/rate'
import { IxSelect, IxSelectOption, IxSelectOptionGroup } from '@idux/components/select'
import { IxSwitch } from '@idux/components/switch'
import { IxTextarea } from '@idux/components/textarea'
import { IxTimePicker } from '@idux/components/time-picker'
// import Data Display
import { IxTable } from '@idux/components/table'
import { IxAvatar } from '@idux/components/avatar'
import { IxCollapse, IxCollapsePanel } from '@idux/components/collapse'
import { IxStepper, IxStepperItem } from '@idux/components/stepper'
import { IxList, IxListItem } from '@idux/components/list'
import { IxBadge } from '@idux/components/badge'
import { IxCard } from '@idux/components/card'
import { IxEmpty } from '@idux/components/empty'
import { IxImage } from '@idux/components/image'
import { IxStatistic } from '@idux/components/statistic'
import { IxTimeline, IxTimelineItem } from '@idux/components/timeline'
import { IxTooltip } from '@idux/components/tooltip'
import { IxPopover } from '@idux/components/popover'
// import Feedback
import { IxDrawer } from '@idux/components/drawer'
import { IxModal } from '@idux/components/modal'
import { IxResult } from '@idux/components/result'
import { IxSpin } from '@idux/components/spin'
import { IxProgress } from '@idux/components/progress'
// import Other
import { IxBackTop } from '@idux/components/back-top'
import { IxAnchor, IxAnchorLink } from '@idux/components/anchor'
// --- import end ---

const components = [
  // components General
  IxButton,
  IxButtonGroup,
  IxIcon,
  IxHeader,
  IxTag,
  // components Layout
  IxDivider,
  IxSpace,
  IxRow,
  IxCol,
  // components Navigation
  IxPagination,
  IxAffix,
  IxDropdown,
  IxDropdownButton,
  IxMenu,
  IxMenuItem,
  IxMenuItemGroup,
  IxMenuDivider,
  IxMenuSub,
  // components Data Entry
  IxForm,
  IxFormItem,
  IxFormWrapper,
  IxCheckbox,
  IxCheckboxGroup,
  IxInput,
  IxTextarea,
  IxRadio,
  IxRadioGroup,
  IxRate,
  IxSelect,
  IxSelectOption,
  IxSelectOptionGroup,
  IxSwitch,
  IxTimePicker,
  // components Data Display
  IxTable,
  IxAvatar,
  IxCollapse,
  IxCollapsePanel,
  IxStepper,
  IxStepperItem,
  IxList,
  IxListItem,
  IxBadge,
  IxCard,
  IxEmpty,
  IxImage,
  IxStatistic,
  IxTimeline,
  IxTimelineItem,
  IxTooltip,
  IxPopover,
  // components Feedback
  IxDrawer,
  IxModal,
  IxResult,
  IxSpin,
  IxProgress,
  // components Other
  IxBackTop,
  IxAnchor,
  IxAnchorLink,
  // --- components end ---
]

const directives: Record<string, Directive> = {
  // directives General
  typography: IxTypography,
  // directives Layout
  // directives Navigation
  // directives Data Entry
  // directives Data Display
  // directives Feedback
  // directives Other
  // --- directives end ---
}

const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component)
  })

  Object.keys(directives).forEach(key => {
    app.directive(key, directives[key])
  })
}

export default {
  install,
  version,
}
