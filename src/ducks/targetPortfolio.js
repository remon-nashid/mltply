// @flow

import type { ExtractReturn } from '../types'
export type Allocation = {
  token: string,
  percentage: number
}
export type TargetPortfolio = {}

export const INIT = 'mltply/targetPortfolio/INIT'
export const ADD = 'mltply/targetPortfolio/ADD'
export const REMOVE = 'mltply/targetPortfolio/REMOVE'
export const RESET = 'mltply/targetPortfolio/RESET'
export const INCREMENT = 'mltply/targetPortfolio/INCREMENT'
export const DECREMENT = 'mltply/targetPortfolio/DECREMENT'
export const MAX = 'mltply/targetPortfolio/MAX'
export const EDIT = 'mltply/targetPortfolio/EDIT'
export const SAVE = 'mltply/targetPortfolio/SAVE'

export function init(targetPortfolio: TargetPortfolio) {
  return { type: INIT, targetPortfolio }
}

export function add(symbol: string, percentage: number = 1) {
  return { type: ADD, symbol, percentage }
}

export function remove(symbol: string) {
  return { type: REMOVE, symbol }
}

export function increment(symbol: string) {
  return { type: INCREMENT, symbol }
}

export function decrement(symbol: string) {
  return { type: DECREMENT, symbol }
}

export function max(symbol: string) {
  return { type: MAX, symbol }
}

export function reset() {
  return { type: RESET }
}

export function edit() {
  return { type: EDIT }
}

export function save() {
  return { type: SAVE }
}

type Action =
  | ExtractReturn<typeof init>
  | ExtractReturn<typeof reset>
  | ExtractReturn<typeof add>
  | ExtractReturn<typeof remove>
  | ExtractReturn<typeof increment>
  | ExtractReturn<typeof decrement>
  | ExtractReturn<typeof max>

const _sum = (targetPortfolio: TargetPortfolio): number => {
  return Object.values(targetPortfolio).reduce(
    (acc: number, val: number) => acc + val,
    0
  )
}

export type State = {
  portfolio: any,
  status: 'complete' | 'review' | 'empty',
  sum: number,
  resetEnabled: boolean,
  initiateEnabled: boolean,
  addEnabled: boolean,
  unallocated: number,
  incrementEnabled: boolean,
  decrementEnabled: boolean,
  recommendations: Array<string>,
  editing: boolean
}

export const initialState: State = {
  portfolio: undefined,
  status: 'empty',
  sum: 0,
  resetEnabled: false,
  initiateEnabled: true,
  addEnabled: true,
  unallocated: 100,
  incrementEnabled: true,
  decrementEnabled: false,
  recommendations: [],
  editing: true
}

const _validate = (prevState: State, nextState: State): State => {
  // Bail early if one target is <= 0 || sum > 100
  const nextSum = _sum(nextState.portfolio)
  if (
    nextSum > 100 ||
    Object.values(nextState.portfolio).find(val => val === 0) !== undefined
  ) {
    return prevState
  }

  const unallocated = 100 - nextSum

  if (Object.values(nextState.portfolio).length === 0) {
    return {
      ...nextState,
      addEnabled: true,
      resetEnabled: false,
      initiateEnabled: true,
      unallocated: 100,
      sum: nextSum,
      status: 'empty'
    }
  } else if (nextSum === 100) {
    return {
      ...nextState,
      status: 'complete',
      resetEnabled: true,
      addEnabled: false,
      sum: nextSum,
      unallocated,
      incrementEnabled: false,
      decrementEnabled: true,
      initiateEnabled: false
    }
  } else if (nextSum < 100) {
    return {
      ...nextState,
      status: 'review',
      resetEnabled: true,
      addEnabled: true,
      sum: nextSum,
      unallocated,
      incrementEnabled: true,
      decrementEnabled: true,
      initiateEnabled: false
    }
  }
  return nextState
}

const reducer = (state: State = initialState, action: Action): State => {
  const { targetPortfolio, symbol, percentage } = action
  let nextState

  switch (action.type) {
    case EDIT:
      return { ...state, editing: true }

    case SAVE:
      return { ...state, editing: false }

    case INIT:
      nextState = { ...state, portfolio: targetPortfolio }
      return _validate(state, nextState)

    /*
      {type: 'mltply/targetPortfolio/ADD', symbol: 'AEON', percentage: 0}
      */
    case ADD:
      nextState = { ...state }
      // FIXME check if exists and return error.
      nextState.portfolio = { ...nextState.portfolio, [symbol]: percentage }
      return _validate(state, nextState)

    /*
      {type: 'mltply/targetPortfolio/REMOVE', symbol: 'BTC'}
      */
    case REMOVE:
      nextState = { ...state }
      delete nextState.portfolio[symbol]
      return _validate(state, nextState)

    case INCREMENT:
      nextState = { ...state }
      nextState.portfolio = {
        ...nextState.portfolio,
        [symbol]: nextState.portfolio[symbol] + 1
      }
      return _validate(state, nextState)

    case DECREMENT:
      nextState = { ...state }
      // FIXME for some reason the followig doesn't trigger UI update.
      // Need to assign nextState.portfolio to a new object.
      //
      // nextState.portfolio[symbol]--
      nextState.portfolio = {
        ...nextState.portfolio,
        [symbol]: nextState.portfolio[symbol] - 1
      }
      return _validate(state, nextState)

    case MAX: {
      nextState = { ...state }
      const { unallocated } = state
      nextState.portfolio = {
        ...nextState.portfolio,
        [symbol]: nextState.portfolio[symbol] + unallocated
      }
      return _validate(state, nextState)
    }
    /*
    {type: 'mltply/targetPortfolio/RESET'}
    */
    case RESET:
      return initialState

    default:
      return state
  }
}

export default reducer
