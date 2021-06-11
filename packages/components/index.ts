import type { App, Directive } from 'vue'

import { version } from './version'

// import General
import { IxButton, IxButtonGroup } from './button'
import { IxIcon } from './icon'
import { IxHeader } from './header'
import { IxTypography } from './typography'
import { IxTag } from './tag'
// import Layout
import { IxDivider } from './divider'
import { IxSpace } from './space'
import { IxRow, IxCol } from './grid'
// import Navigation
import { IxPagination } from './pagination'
import { IxAffix } from './affix'
import { IxDropdown, IxDropdownButton } from './dropdown'
import { IxMenu, IxMenuItem, IxMenuItemGroup, IxMenuDivider, IxSubMenu } from './menu'
// import Data Entry
import { IxForm, IxFormItem, IxFormWrapper } from './form'
import { IxCheckbox, IxCheckboxGroup } from './checkbox'
import { IxInput, IxTextarea } from './input'
import { IxRadio, IxRadioButton, IxRadioGroup } from './radio'
import { IxRate } from './rate'
import { IxSelect, IxOption, IxOptionGroup } from './select'
import { IxSwitch } from './switch'
// import Data Display
import { IxCollapse, IxCollapsePanel } from './collapse'
import { IxSteps, IxStep } from './steps'
import { IxList, IxListItem } from './list'
import { IxBadge } from './badge'
import { IxCard } from './card'
import { IxEmpty } from './empty'
import { IxImage } from './image'
import { IxStatistic } from './statistic'
import { IxTimeline, IxTimelineItem } from './timeline'
import { IxTooltip } from './tooltip'
import { IxPopover } from './popover'
// import Feedback
import { IxResult } from './result'
import { IxSpin } from './spin'
import { IxProgress } from './progress'
// import Other
import { IxBackTop } from './back-top'
import { IxAnchor, IxAnchorLink } from './anchor'
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
  IxSubMenu,
  // components Data Entry
  IxForm,
  IxFormItem,
  IxFormWrapper,
  IxCheckbox,
  IxCheckboxGroup,
  IxInput,
  IxTextarea,
  IxRadio,
  IxRadioButton,
  IxRadioGroup,
  IxRate,
  IxSelect,
  IxOption,
  IxOptionGroup,
  IxSwitch,
  // components Data Display
  IxCollapse,
  IxCollapsePanel,
  IxSteps,
  IxStep,
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
