/* @flow */

import { Platform } from 'react-native'
import { combineReducers } from 'redux'
import ccxt, { AuthenticationError } from 'ccxt'
import equal from 'deep-equal'

import type { Dispatch } from 'redux'
import { getAssetsBySourceId } from './_selectors'
import { saveMultiple } from './assets'
import { addError, removeError } from './errors'
import config from '../config'

import type { Asset } from './assets'
import type { ExtractReturn } from '../types'

// Flow types
export type ExchangeCredentials = {
  apiKey: string,
  secret?: string,
  password?: string,
  uid?: string,
  login?: string,
  twofa?: string
}

export type ExchangeConnection = {
  id: string,
  slug: string,
  credentials: ExchangeCredentials,
  ui: { error?: string, loading: boolean }
}

export type ExchangeProps = {
  slug: string,
  name: string,
  docUrl: string,
  requiredCredentials: Object
}

/********************
 * Action creators
 *******************/
const SAVE_CONNECTION = 'mltply/exchanges/SAVE_CONNECTION'
const DELETE_CONNECTION = 'mltply/exchanges/DELETE_CONNECTION'

export function saveConnection(connection: ExchangeConnection) {
  return { type: SAVE_CONNECTION, connection }
}

export function deleteConnection(id: string) {
  return { type: DELETE_CONNECTION, id }
}

const AUTHENTICATING = 'mltply/exchanges/AUTHENTICATING'
const AUTH_SUCCESSFUL = 'mltply/exchanges/AUTH_SUCCESSFUL'
const AUTH_FAILED = 'mltply/exchanges/AUTH_FAILED'
const RESET_UI = 'mltply/exchanges/RESET_UI'

export function authenticating() {
  return { type: AUTHENTICATING }
}

export function authSuccessful(response: mixed) {
  return { type: AUTH_SUCCESSFUL, response }
}

export function authFailed(error: string) {
  return { type: AUTH_FAILED, error }
}

export function resetUI() {
  return { type: RESET_UI }
}

const BALANCE_RECEIVED = 'mltply/exchanges/BALANCE_RECEIVED',
  BALANCE_LOAD = 'mltply/exchanges/BALANCE_LOAD',
  BALANCE_ERROR = 'mltply/exchanges/BALANCE_ERROR',
  SAVE_CCXT_EXCHANGE = 'mltply/exchanges/SAVE_CCXT_EXCHANGE'

export function loadingBalance(connection: ExchangeConnection) {
  return { type: BALANCE_LOAD, connection }
}

export function balanceError(connection: ExchangeConnection, error: string) {
  return { type: BALANCE_ERROR, connection, error }
}

export function balanceReceived(connection: ExchangeConnection) {
  return { type: BALANCE_RECEIVED, connection }
}

export function saveCCXTExchange(id: string, exchange: Object) {
  return { type: SAVE_CCXT_EXCHANGE, id, exchange }
}

const INIT_EXCHANGE_PROPS = 'mltply/exchanges/INIT_EXCHANGE_PROPS',
  RESET_EXCHANGE_PROPS = 'mltply/exchanges/RESET_EXCHANGE_PROPS'

export function initExchangeProps(ccxt: any) {
  return { type: INIT_EXCHANGE_PROPS, ccxt }
}

export function resetExchangeProps() {
  return { type: RESET_EXCHANGE_PROPS }
}

export type Action =
  | ExtractReturn<typeof saveConnection>
  | ExtractReturn<typeof deleteConnection>
  | ExtractReturn<typeof authenticating>
  | ExtractReturn<typeof authSuccessful>
  | ExtractReturn<typeof authFailed>
  | ExtractReturn<typeof loadingBalance>
  | ExtractReturn<typeof balanceError>
  | ExtractReturn<typeof resetUI>
  | ExtractReturn<typeof initExchangeProps>
  | ExtractReturn<typeof resetExchangeProps>

/********************
 * Async action creators
 *******************/

export function ccxtRequest(
  connection: ExchangeConnection,
  operation: string
): Function {
  return function(dispatch: Dispatch<any>, getState): Promise<any> {
    let credentials = {
      ...connection.credentials,
      enableRateLimit: true
    }

    if (Platform.OS === 'web' && process.env.REACT_APP_CORS_PROXY) {
      credentials = { ...credentials, proxy: process.env.REACT_APP_CORS_PROXY }
    }

    if (!(connection.slug in ccxt)) {
      throw new Error(`${connection.slug} is not supported.`)
    }

    let CCXTExchange
    if (
      connection.id !== undefined &&
      getState().exchanges.pool[connection.id] !== undefined
    ) {
      CCXTExchange = getState().exchanges.pool[connection.id]
    } else {
      CCXTExchange = new ccxt[connection.slug](credentials)
      dispatch(saveCCXTExchange(connection.id, CCXTExchange))
    }
    if (!(operation in CCXTExchange)) {
      throw new Error(`Operation ${operation} does not exist.`)
    }
    CCXTExchange = Object.assign(CCXTExchange, credentials, {
      rateLimit:
        CCXTExchange.rateLimit > config.ccxtRateLimit
          ? CCXTExchange.rateLimit
          : config.ccxtRateLimit
    })

    // Return promise
    return CCXTExchange[operation]()
  }
}

export function authenticate(connection: ExchangeConnection, navigation: any) {
  return (dispatch: Dispatch<any>) => {
    dispatch(authenticating())
    dispatch(ccxtRequest(connection, 'fetchBalance'))
      .then(response => {
        dispatch(authSuccessful(response))
        dispatch(saveConnection(connection))
        dispatch(loadBalance(connection))
        navigation.goBack()
      })
      .catch(ex => {
        console.log(ex)
        if (ex instanceof AuthenticationError) {
          dispatch(
            authFailed(`Authentication Error. Please check your credentials.`)
          )
        } else {
          dispatch(
            authFailed(
              `An error has occurred while connecting. Please try again later.`
            )
          )
        }
      })
  }
}

export function loadBalance(connection: ExchangeConnection) {
  return (dispatch: Dispatch<any>, getState: Function) => {
    dispatch(ccxtRequest(connection, 'fetchBalance'))
      .then(response => {
        dispatch(balanceReceived(connection))
        dispatch(removeError())
        if ('free' in response) {
          const sourceId = connection.id
          const filteredAssets: Array<Asset> = Object.entries(response.free)
            .filter(pair => pair[1] > 0)
            .map(pair => {
              return { symbol: pair[0], amount: Number(pair[1]), sourceId }
            })
          const existingAssets = getAssetsBySourceId(
            getState().assets,
            sourceId
          )
          // Only update state if exchange assets have changed
          if (!equal(existingAssets, filteredAssets)) {
            dispatch(saveMultiple(sourceId, filteredAssets))
          }
        }
      })
      .catch(ex => {
        console.log(ex)
        if (ex instanceof AuthenticationError) {
          const message = 'Authentication Error. Please check your credentials.'
          dispatch(balanceError(connection, message))
          dispatch(addError(`${connection.name}: ${message}`))
        } else {
          const message =
            'An error has occurred while loading balance. Please try again later.'
          dispatch(balanceError(connection, message))
          dispatch(addError(`${connection.name}: ${message}`))
        }
      })
  }
}

/********************
 * Reducers
 *******************/

export const initialState = {
  connections: [],
  ui: {
    loading: false
  },
  pool: {}
}

type uiState = {
  loading: boolean,
  error?: string
}
function uiReducer(state: uiState = initialState.ui, action: Action): uiState {
  switch (action.type) {
    case AUTHENTICATING:
      return Object.assign({}, state, { loading: true })

    case AUTH_SUCCESSFUL:
      return Object.assign({}, state, {
        loading: false,
        error: undefined
      })

    case AUTH_FAILED: {
      let nextState = Object.assign({}, state, {
        loading: false,
        error: action.error
      })
      return nextState
    }

    case RESET_UI:
      return initialState.ui

    default:
      return state
  }
}

type connectionsState = Array<ExchangeConnection>
function connectionsReducer(
  state: connectionsState = initialState.connections,
  action: Action
): connectionsState {
  let { connection, id, error } = action
  switch (action.type) {
    case SAVE_CONNECTION: {
      let nextState = state.filter(item => item.id !== connection.id)
      connection.ui = { error: undefined, loading: false }
      nextState.push(connection)
      return nextState
    }

    case DELETE_CONNECTION:
      return state.filter(item => item.id !== id)

    case BALANCE_RECEIVED: {
      return state.map(item => {
        if (item.id === connection.id) {
          return { ...item, ui: { error: undefined, loading: false } }
        }
        return item
      })
    }

    case BALANCE_LOAD: {
      return state.map(item => {
        if (item.id === connection.id) {
          return { ...item, ui: { ...item.ui, loading: true } }
        }
        return item
      })
    }

    case BALANCE_ERROR: {
      let nextState2 = state.map(item => {
        if (item.id === connection.id) {
          return { ...item, ui: { error, loading: false } }
        }
        return item
      })
      return nextState2
    }

    default:
      return state
  }
}

type poolState = {}
function poolReducer(
  state: poolState = initialState.pool,
  action: Action
): poolState {
  const { type, id, exchange } = action
  switch (type) {
    case SAVE_CCXT_EXCHANGE:
      return { ...state, [id]: exchange }

    default:
      return state
  }
}

const exchangePropsInitial = []
function exchangePropsReducer(
  state: Array<ExchangeProps> = exchangePropsInitial,
  action: Action
): Array<ExchangeProps> {
  switch (action.type) {
    case INIT_EXCHANGE_PROPS: {
      const ccxt = action.ccxt
      return ccxt.exchanges.map(slug => {
        var exchange = new ccxt[slug]()
        return {
          slug,
          name: exchange.name,
          docUrl: Array.isArray(exchange.urls['doc'])
            ? exchange.urls['doc'][0]
            : exchange.urls['doc'],
          requiredCredentials: exchange.requiredCredentials
        }
      })
    }
    case RESET_EXCHANGE_PROPS:
      return exchangePropsInitial
    default:
      return state
  }
}

const reducer = combineReducers({
  connections: connectionsReducer,
  ui: uiReducer,
  pool: poolReducer,
  props: exchangePropsReducer
})

export default reducer
