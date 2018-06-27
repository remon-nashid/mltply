// @flow

export type Asset = {
  symbol: string,
  amount: number,
  sourceId: string
}
type State = Array<Asset>

const SAVE = 'mltply/assets/SAVE'
const REMOVE = 'mltply/assets/REMOVE'
const REMOVE_BY_SOURCE = 'mltply/assets/REMOVE_BY_SOURCE'
const RESET = 'mltply/assets/RESET'

/*
{type: 'mltply/assets/SAVE', sourceId: 'manual', symbol: 'BTC', amount: 1.1}
*/
export function save(sourceId: string, symbol: string, amount: number) {
  return { type: SAVE, sourceId, symbol, amount }
}

/*
{type: 'mltply/assets/REMOVE', symbol: 'BTC', sourceId: 'manual'}
*/
export function remove(sourceId: string, symbol: string) {
  return { type: REMOVE, sourceId, symbol }
}

export function removeBySource(sourceId: string) {
  return { type: REMOVE_BY_SOURCE, sourceId }
}

/*
{type: 'mltply/assets/RESET'}
*/
const initialState = []
export function reset() {
  return { type: RESET }
}

const isEqual = (sourceId: string, symbol: string) => {
  return (asset: Asset) =>
    asset.sourceId === sourceId &&
    (symbol !== undefined ? asset.symbol === symbol : true)
}

// FIXME just negate previous funciton
const isntEqual = (sourceId: string, symbol?: string) => {
  return (asset: Asset) =>
    asset.sourceId !== sourceId ||
    (symbol !== undefined ? asset.symbol !== symbol : false)
}

export default function reducer(state: State = initialState, action): State {
  switch (action.type) {
    case RESET:
      return initialState

    case SAVE:
      const asset = {
        sourceId: action.sourceId,
        symbol: action.symbol,
        amount: Number(action.amount)
      }
      const i = state.findIndex(isEqual(action.sourceId, action.symbol))
      if (i !== -1) {
        state = [...state]
        state[i] = asset
      } else return [...state, asset]
      return state

    case REMOVE:
      return state.filter(isntEqual(action.sourceId, action.symbol))

    case REMOVE_BY_SOURCE:
      return state.filter(isntEqual(action.sourceId))

    default:
      return state
  }
}

/*
 Selectors
 */

export function getManualAssets(assets: Array<Asset>): Array<Asset> {
  return assets.filter(({ sourceId }) => sourceId === 'manual')
}
