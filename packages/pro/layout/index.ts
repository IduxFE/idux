/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { LayoutProComponent } from './src/types'
import type { MenuClickOptions, MenuData } from '@idux/components/menu'

import LayoutPro from './src/Layout'
import LayoutProCtrl from './src/LayoutCtrl'

const IxLayoutPro = LayoutPro as unknown as LayoutProComponent
const IxLayoutProCtrl = LayoutProCtrl

export type { MenuClickOptions, MenuData }
export type { LayoutProThemes, LayoutProModeTypes, LayoutProProps } from './src/types'
export { IxLayoutPro, IxLayoutProCtrl }
