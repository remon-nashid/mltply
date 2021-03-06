/* @flow */

import { Platform } from 'react-native'

import config from '../config'
import type { ExtractReturn } from '../types'
import { addError, removeError } from './errors'

// Types
export type Token = {
  Id: string,
  slug: string,
  symbol: string,
  name: string,
  value: number
}

export const RECEIVED = 'mltply/tokens/RECEIVED'
export const RESET = 'mltply/tokens/RESET'

export function received(data: Object) {
  return { type: RECEIVED, data }
}

export function reset() {
  return { type: RESET }
}

export type Action =
  | ExtractReturn<typeof received>
  | ExtractReturn<typeof reset>

export function proxiedFetch(url: string, ...args: Array<any>) {
  if (
    Platform.OS !== 'ios' &&
    Platform.OS !== 'android' &&
    process.env.REACT_APP_CORS_PROXY &&
    config.fetchProxy
  ) {
    url = config.REACT_APP_CORS_PROXY + url
  }
  return fetch(url, ...args)
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

export function tokenMatch(keyword: string): Function {
  return function(token: Token): boolean {
    return (
      token.slug.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
      token.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
      token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    )
  }
}

export function filterTokens(
  tokens: Array<Token>,
  keyword: string,
  exclude: Array<string> = []
): Array<Token> {
  return tokens
    .filter(tokenMatch(keyword))
    .filter(token => exclude.findIndex(value => value === token.Id) === -1)
    .sort((a, b) => (a.Id <= b.Id ? -1 : 1))
    .splice(0, 50)
}

export function fetchResource(key: string, url: string): Function {
  return function(dispatch: Dispatch<any>, getState) {
    const baseFiat = getState().settings.baseFiat
    return proxiedFetch(url)
      .then(status)
      .then(json)
      .then(data => {
        if (key === 'crypto') {
          const tokens = Object.keys(data.data)
            .map(key => {
              var obj = data.data[key]
              return {
                Id: obj.symbol,
                type: 'token',
                name: obj.name,
                symbol: obj.symbol,
                slug: obj.website_slug,
                price: obj.quotes[baseFiat].price,
                history: {
                  '1h': obj.quotes[baseFiat].percent_change_1h,
                  '1d': obj.quotes[baseFiat].percent_change_24h,
                  '7d': obj.quotes[baseFiat].percent_change_7d
                }
              }
            })
            .sort((a, b) => {
              return a.Id < b.Id ? -1 : 1
            })
            .reduce((acc, token) => {
              acc[token.Id] = token
              return acc
            }, {})
          dispatch(received(tokens))
        } else if (key === 'fiat') {
          const fiat = Object.keys(data.rates)
            .map(key => {
              return {
                Id: key,
                type: 'fiat',
                name: key,
                symbol: key,
                slug: key,
                price: 1 / data.rates[key]
              }
            })
            .reduce((acc, fiat) => {
              acc[fiat.Id] = fiat
              return acc
            }, {})
          dispatch(removeError())
          dispatch(received(fiat))
        }
      })
      .catch(err => {
        console.error(err)
        dispatch(
          addError(
            'Failed to fetch currency exchange rates. Please try again later.'
          )
        )
      })
  }
}

type State = {
  filter?: string,
  data: {}
}
const initialState = {
  filter: undefined,
  data: {}
}
const reducer = (state: State = initialState, action: Action) => {
  const { type, data } = action
  switch (type) {
    case RECEIVED:
      return { ...state, data: { ...state.data, ...data } }

    case RESET:
      /*
      {
        type: 'mltply/tokens/RESET'
      }
      */
      return initialState

    default:
      return state
  }
}

export default reducer
