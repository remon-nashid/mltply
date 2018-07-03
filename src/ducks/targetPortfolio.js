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
  messages: Array<string>,
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
  messages: [],
  sum: 0,
  resetEnabled: false,
  initiateEnabled: false,
  addEnabled: true,
  unallocated: 100,
  incrementEnabled: true,
  decrementEnabled: false,
  recommendations: [],
  editing: true
}

const _validate = (prevState: State, nextState: State): State => {
  const nextSum = _sum(nextState.portfolio)
  const unallocated = 100 - nextSum

  if (Object.values(nextState.portfolio).length === 0) {
    return {
      ...nextState,
      status: 'empty',
      messages: [],
      resetEnabled: false,
      addEnabled: true,
      sum: nextSum,
      unallocated: 100
    }
  } else if (nextSum === 100) {
    return {
      ...nextState,
      status: 'complete',
      messages: [],
      resetEnabled: true,
      addEnabled: false,
      sum: nextSum,
      unallocated,
      incrementEnabled: false,
      decrementEnabled: true
    }
  } else if (nextSum < 100) {
    return {
      ...nextState,
      status: 'review',
      messages: ['Should equal 100%'],
      resetEnabled: true,
      addEnabled: true,
      sum: nextSum,
      unallocated,
      incrementEnabled: true,
      decrementEnabled: true
    }
  }
  return nextState
}

const reducer = (state: State = initialState, action: Action): State => {
  const { targetPortfolio, symbol, percentage } = action
  let nextState

  switch (action.type) {
    case INIT:
      nextState = { ...state, portfolio: targetPortfolio }
      return _validate(state, nextState)

    /*
      {type: 'mltply/targetPortfolio/ADD', symbol: 'AEON', percentage: 0}
      */
    case ADD:
      nextState = { ...state }
      // FIXME check if exists and return error.
      nextState.portfolio = {
        ...nextState.portfolio,
        [symbol]: percentage
      }
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
