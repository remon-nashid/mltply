// @flow

import config from '../../config'

import type { ExtractReturn } from '../types'

export const SAVE_SETTING = 'mltply/settings/SAVE_SETTING'
export const RESET = 'mltply/settings/RESET'

export function saveSetting(key: string, value: string) {
  return { type: SAVE_SETTING, key, value }
}

export function reset() {
  return { type: RESET }
}

type Action = ExtractReturn<typeof saveSetting> | ExtractReturn<typeof reset>
export type State = {
  baseFiat: string,
  minAssetBalance: number
}

const initialState: State = {
  baseFiat: config.settings.baseFiat,
  minAssetBalance: config.settings.minAssetBalance
}
const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SAVE_SETTING:
      const { key, value } = action
      return Object.assign({}, state, { [key]: value })

    case RESET:
      return initialState

    default:
      return state
  }
}

export default reducer
