/* @flow */

import { Platform } from 'react-native'

import config from '../../config'
import type { ExtractReturn } from '../types'

// Types
export type Token = {
  Id: string,
  slug: string,
  symbol: string,
  name: string,
  inBaseFiat: number
}
export type Action =
  | ExtractReturn<typeof received>
  | ExtractReturn<typeof reset>

export const RECEIVED = 'mltply/tokens/RECEIVED'
export const RESET = 'mltply/tokens/RESET'

export function received(data: Object | Array<any>) {
  return { type: RECEIVED, data }
}

export function reset() {
  return { type: RESET }
}

// FIXME proxy all requests for now. That will free us from caching 3rd party
// resources on mobiles.
export function proxiedFetch(url: string, ...args: Array<any>) {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    url = config.corsProxyURL + url
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
}

// FIXME refactor into resource specific code
export function fetchResource(key: string, url: string): Function {
  return function(dispatch: Dispatch<any>, getState) {
    const baseFiat = getState().settings.baseFiat
    return proxiedFetch(url)
      .then(status)
      .then(json)
      .then(data => {
        if (key === 'tokens') {
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

          dispatch(received(fiat))
        }
      })
      .catch(err => console.error(err))
  }
}

type State = {}
const initialState = {}
const reducer = (state: State = initialState, action: Action) => {
  const { type, data } = action
  switch (type) {
    case RECEIVED:
      return { ...state, ...data }

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
