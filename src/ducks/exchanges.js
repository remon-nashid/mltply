/* @flow */

import { Platform } from 'react-native'
import { combineReducers } from 'redux'
import ccxt, { AuthenticationError, NetworkError } from 'ccxt'

import type { Dispatch } from 'redux'
import { save, removeBySource } from './assets'
import config from '../../config'

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
  requiredCredentials: {}
}

/********************
 * Action creators
 *******************/
const SAVE_EXCHANGE = 'mltply/exchanges/SAVE_EXCHANGE'
const DELETE_CONNECTION = 'mltply/exchanges/DELETE_CONNECTION'
// SHOW_FORM = 'mltply/exchanges/SHOW_FORM',
// CLOSE_FORM = 'mltply/exchanges/CLOSE_FORM'

export function saveConnection(connection: ExchangeConnection) {
  return { type: SAVE_EXCHANGE, connection }
}

export function deleteConnection(id: string) {
  return { type: DELETE_CONNECTION, id }
}

// export function closeForm() {
//   return { type: CLOSE_FORM }
// }

// export function showForm(id?: string) {
//   return { type: SHOW_FORM, id }
// }

const AUTHENTICATING = 'mltply/exchanges/AUTHENTICATING'
const AUTH_SUCCESSFUL = 'mltply/exchanges/AUTH_SUCCESSFUL'
const AUTH_FAILED = 'mltply/exchanges/AUTH_FAILED'

export function authenticating() {
  return { type: AUTHENTICATING }
}

export function authSuccessful(response: mixed) {
  return { type: AUTH_SUCCESSFUL, response }
}

export function authFailed(error: string) {
  return { type: AUTH_FAILED, error }
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
  // | ExtractReturn<typeof showForm>
  // | ExtractReturn<typeof closeForm>
  | ExtractReturn<typeof deleteConnection>
  | ExtractReturn<typeof authenticating>
  | ExtractReturn<typeof authSuccessful>
  | ExtractReturn<typeof authFailed>
  | ExtractReturn<typeof loadingBalance>
  | ExtractReturn<typeof balanceError>
  | ExtractReturn<typeof initExchangeProps>
  | ExtractReturn<typeof resetExchangeProps>

/********************
 * Utility functions
 *******************/

function ccxtBalance2Local(ccxtBalance, id): Array<Asset> {
  return Object.keys(ccxtBalance)
    .filter(key => {
      return !['free'].includes(key)
    })
    .map(key => {
      const { asset, free } = ccxtBalance[key]
      // used, total
      return { symbol: asset, amount: free, sourceId: id }
    })
    .filter(({ amount }) => amount > 0)
}

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

    if (Platform.OS === 'web') {
      credentials = { ...credentials, proxy: config.corsProxyURL }
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

export function authenticate(connection: ExchangeConnection) {
  return (dispatch: Dispatch<any>) => {
    dispatch(authenticating())
    dispatch(ccxtRequest(connection, 'fetchBalance'))
      .then(response => {
        dispatch(authSuccessful(response))
        dispatch(saveConnection(connection))
        dispatch(loadBalance(connection))
      })
      .catch(ex => {
        if (ex instanceof AuthenticationError) {
          dispatch(
            authFailed(
              `Authentication Error: ${ex.message}. Check your credentials`
            )
          )
        } else if (ex instanceof NetworkError) {
          // FIXME generic requestFiled
          dispatch(authFailed(`Network Error: ${ex.message}. Tru again later`))
        } else {
          // FIXME generic requestFiled
          dispatch(authFailed(ex.message))
        }
        throw ex
      })
  }
}

export function loadBalance(connection: ExchangeConnection) {
  return (dispatch: Dispatch<any>) => {
    dispatch(loadingBalance(connection))
    dispatch(ccxtRequest(connection, 'fetchBalance'))
      .then(response => {
        dispatch(balanceReceived(connection))

        if ('info' in response) {
          // Remove existing assets that are related to this connection.
          dispatch(removeBySource(connection.id))
          const filteredAssets = ccxtBalance2Local(
            response.info.balances,
            connection.id
          )
          filteredAssets.forEach(({ sourceId, symbol, amount }) => {
            dispatch(save(sourceId, symbol, amount))
          })
        }
      })
      .catch(err => {
        console.log('err', err)
        // FIXME generic requestFiled
        dispatch(balanceError(connection, err.messages))
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
    //  editing: false
  },
  pool: {}
}

type uiState = {
  loading: boolean,
  // editing?: string | boolean,
  error?: string
}
function uiReducer(state: uiState = initialState.ui, action: Action): uiState {
  switch (action.type) {
    // case SHOW_FORM:
    //   return Object.assign({}, state, { editing: action.id || true })

    // case CLOSE_FORM:
    //   return Object.assign({}, state, {
    //     editing: false,
    //     messages: undefined,
    //     error: undefined
    //   })

    case AUTHENTICATING:
      return Object.assign({}, state, { loading: true })

    case AUTH_SUCCESSFUL:
      return Object.assign({}, state, {
        loading: false,
        // editing: false,
        error: undefined
      })

    case AUTH_FAILED: {
      let nextState = Object.assign({}, state, {
        loading: false,
        error: action.error
      })
      return nextState
    }

    // case DELETE_CONNECTION:
    //   return Object.assign({}, state, {
    //     editing: state.editing === action.id ? false : state.editing
    //   })

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
    case SAVE_EXCHANGE: {
      let nextState = state.filter(item => item.id !== connection.id)
      nextState.push(connection)
      return nextState
    }

    case DELETE_CONNECTION:
      return state.filter(item => item.id !== id)

    case BALANCE_RECEIVED: {
      return state.map(item => {
        if (item.id === connection.id) {
          item.ui = { loading: false }
        }
        return item
      })
    }

    case BALANCE_LOAD: {
      let nextState = state.map(item => {
        if (item.id === connection.id) {
          item.ui = { loading: true }
        }
        return item
      })
      return nextState
    }

    case BALANCE_ERROR: {
      let nextState2 = state.map(item => {
        if (item.id === connection.id) {
          item.ui = { error, loading: false }
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
