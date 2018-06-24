/* @flow */

import { Platform } from 'react-native'
import { combineReducers } from 'redux'
import ccxt, { AuthenticationError, NetworkError } from 'ccxt'
import uuidv4 from 'uuid/v4'

import { save, removeBySource } from './assets'

import type { Dispatch } from 'redux'
import type { Asset } from './assets'
import type { ExtractReturn } from '../types'

// Flow types
export type ExchangeCredentials = {
  apiKey: string,
  secret: string,
  password?: string,
  uid?: string,
  proxy?: string
}

export type Exchange = {
  // local ID
  id: string,
  // CCXT exchange.id
  exchangeId: string,
  credentials: ExchangeCredentials,
  ui: { error?: string, loading: boolean }
}

/********************
 * Action creators
 *******************/
const POST = 'my-app/exchanges/POST',
  REMOVE = 'my-app/exchanges/REMOVE',
  SHOW_FORM = 'my-app/exchanges/SHOW_FORM',
  CLOSE_FORM = 'my-app/exchanges/CLOSE_FORM'

export function postExchange(exchange: Exchange) {
  return { type: POST, exchange }
}

export function removeExchange(id: string) {
  return { type: REMOVE, id }
}

export function closeForm() {
  return { type: CLOSE_FORM }
}

export function showForm(id?: string) {
  return { type: SHOW_FORM, id }
}

const REQUEST_SEND = 'my-app/exchanges/REQUEST_SEND',
  REUQUEST_SUCCESSFUL = 'my-app/exchanges/REUQUEST_SUCCESSFUL',
  REQUEST_FAILED = 'my-app/exchanges/REQUEST_FAILED'

export function requestSend() {
  return { type: REQUEST_SEND }
}

export function requestSuccessful(response: mixed) {
  return { type: REUQUEST_SUCCESSFUL, response }
}

export function requestFailed(error: string) {
  return { type: REQUEST_FAILED, error }
}

const BALANCE_RECEIVED = 'my-app/exchanges/BALANCE_RECEIVED',
  BALANCE_LOAD = 'my-app/exchanges/BALANCE_LOAD',
  BALANCE_ERROR = 'my-app/exchanges/BALANCE_ERROR',
  SAVE_CCXT_EXCHANGE = 'my-app/exchanges/SAVE_CCXT_EXCHANGE'

export function balanceLoad(exchange: Exchange) {
  return { type: BALANCE_LOAD, exchange }
}

export function balanceError(exchange: Exchange, error: string) {
  return { type: BALANCE_ERROR, exchange, error }
}

export function balanceReceived(exchange: Exchange) {
  return { type: BALANCE_RECEIVED, exchange }
}

export function saveCCXTExchange(id: string, exchange: Object) {
  return { type: SAVE_CCXT_EXCHANGE, id, exchange }
}

export type Action =
  | ExtractReturn<typeof postExchange>
  | ExtractReturn<typeof showForm>
  | ExtractReturn<typeof closeForm>
  | ExtractReturn<typeof removeExchange>
  | ExtractReturn<typeof requestSend>
  | ExtractReturn<typeof requestSuccessful>
  | ExtractReturn<typeof requestFailed>
  | ExtractReturn<typeof balanceLoad>
  | ExtractReturn<typeof balanceLoad>
  | ExtractReturn<typeof balanceError>

/********************
 * Utility functions
 *******************/

function ccxtBalance2Local(ccxtBalance, exchangeId): Array<Asset> {
  return Object.keys(ccxtBalance)
    .filter(key => {
      return !['free'].includes(key)
      // , 'total', 'used', 'info'
    })
    .map(key => {
      const { asset, free } = ccxtBalance[key]
      // used, total
      return { symbol: asset, amount: free, sourceId: exchangeId }
    })
    .filter(({ amount }) => amount > 0)
}

/********************
 * Async action creators
 *******************/

export function requestAsync(exchange: Exchange, operation: string): Function {
  return function(dispatch: Dispatch<any>, getState): Promise<any> {
    const credentials = {
      ...exchange.credentials,
      enableRateLimit: true
    }

    if (Platform.OS === 'web') {
      credentials.proxy = process.env.REACT_APP_CORS_PROXY
    }

    if (!(exchange.exchangeId in ccxt)) {
      throw new Error(`${exchange.exchangeId} is not supported.`)
    }

    let CCXTExchange
    if (
      exchange.id !== undefined &&
      getState().exchanges.pool[exchange.id] !== undefined
    ) {
      CCXTExchange = getState().exchanges.pool[exchange.id]
    } else {
      CCXTExchange = new ccxt[exchange.exchangeId](credentials)
      dispatch(saveCCXTExchange(exchange.id, CCXTExchange))
    }
    if (!(operation in CCXTExchange)) {
      throw new Error(`Operation ${operation} does not exist.`)
    }
    CCXTExchange = Object.assign(CCXTExchange, credentials, {
      rateLimit:
        CCXTExchange.rateLimit > process.env.REACT_APP_RATE_LIMIT
          ? CCXTExchange.rateLimit
          : process.env.REACT_APP_RATE_LIMIT
    })

    // Return promise
    return CCXTExchange[operation]()
  }
}

export function loadBalance(exchange: Exchange) {
  return (dispatch: Dispatch<any>) => {
    dispatch(balanceLoad(exchange))
    dispatch(requestAsync(exchange, 'fetchBalance'))
      .then(response => {
        dispatch(balanceReceived(exchange))

        if ('info' in response) {
          // Remove existing assets that are related to this exchange.
          dispatch(removeBySource(exchange.id))
          const filteredAssets = ccxtBalance2Local(
            response.info.balances,
            exchange.id
          )
          filteredAssets.forEach(({ sourceId, symbol, amount }) => {
            dispatch(save(sourceId, symbol, amount))
          })
        }
      })
      .catch(err => {
        console.log('err', err)
        // TODO this could be a generic error handler that displays error in a
        // modal.
        dispatch(balanceError(exchange, err.messages))
      })
  }
}

export function saveExchange(exchange: Exchange) {
  return (dispatch: Dispatch<any>) => {
    // Show spinner
    dispatch(requestSend())
    // Send request
    dispatch(requestAsync(exchange, 'fetchBalance'))
      .then(response => {
        dispatch(requestSuccessful(response))
        dispatch(postExchange(exchange))
        dispatch(loadBalance(exchange))
      })
      .catch(ex => {
        if (ex instanceof AuthenticationError) {
          // TODO display a generic "Authentication Failed" error instead
          // of the exchange verbose messages.
          dispatch(requestFailed('AuthenticationError: ' + ex.message))
        } else if (ex instanceof NetworkError) {
          // TODO same.
          dispatch(requestFailed('NetworkError: ' + ex.message))
        } else {
          dispatch(requestFailed(ex.message))
        }
        throw ex
      })
  }
}

/********************
 * Reducers
 *******************/

export const initialState = {
  list: [],
  ui: { loading: false, editing: false },
  pool: {}
}

type uiState = {
  loading: boolean,
  editing?: string | boolean,
  error?: string
}
function uiReducer(state: uiState = initialState.ui, action: Action): uiState {
  switch (action.type) {
    case SHOW_FORM:
      return Object.assign({}, state, { editing: action.id || true })

    case CLOSE_FORM:
      return Object.assign({}, state, {
        editing: false,
        messages: undefined,
        error: undefined
      })

    case REQUEST_SEND:
      return Object.assign({}, state, { loading: true })

    case REUQUEST_SUCCESSFUL:
      return Object.assign({}, state, {
        loading: false,
        editing: false,
        error: undefined
      })

    case REQUEST_FAILED:
      let nextState = Object.assign({}, state, {
        loading: false,
        error: action.error
      })
      return nextState

    case REMOVE:
      return Object.assign({}, state, {
        editing: state.editing === action.id ? false : state.editing
      })

    default:
      return state
  }
}

type listState = Array<Exchange>
function listReducer(
  state: listState = initialState.list,
  action: Action
): listState {
  let { exchange, id, error } = action
  switch (action.type) {
    case POST:
      if ('id' in exchange && exchange.id !== undefined) {
        let nextState = state.filter(item => item.id !== exchange.id)
        nextState.push(exchange)
        return nextState
      } else {
        exchange.id = uuidv4()
        return [...state, exchange]
      }

    case REMOVE:
      return state.filter(item => item.id !== id)

    case BALANCE_RECEIVED:
      return state.map(item => {
        if (item.id === exchange.id) {
          item.ui = { loading: false }
        }
        return item
      })

    case BALANCE_LOAD:
      let nextState = state.map(item => {
        if (item.id === exchange.id) {
          item.ui = { loading: true }
        }
        return item
      })
      return nextState

    case BALANCE_ERROR:
      let nextState2 = state.map(item => {
        if (item.id === exchange.id) {
          item.ui = { error, loading: false }
        }
        return item
      })
      return nextState2

    default:
      return state
  }
}

type poolState = Object
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

const reducer = combineReducers({
  list: listReducer,
  ui: uiReducer,
  pool: poolReducer
})

export default reducer
