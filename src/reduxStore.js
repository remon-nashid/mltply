// @flow

import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistCombineReducers, persistStore } from 'redux-persist'
import { createBlacklistFilter } from 'redux-persist-transform-filter'
import storage from 'redux-persist/lib/storage'

import * as reducers from './ducks/index'

const saveAndloadSubsetFilter = createBlacklistFilter(
  'exchanges',
  ['ui', 'pool'],
  ['ui', 'pool']
)

const persistConfig = {
  key: 'mltply',
  storage,
  debug: true,
  transforms: [saveAndloadSubsetFilter]
}

// See https://github.com/reactjs/redux/issues/2359
const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

let middlewares =
  process.env.NODE_ENV !== 'production'
    ? [
        require('redux-immutable-state-invariant').default({
          ignore: ['exchanges.pool', 'exchanges.props']
        }),
        thunk
      ]
    : [thunk]
let store = createStore(
  persistCombineReducers(persistConfig, reducers),
  undefined,
  composeEnhancers(applyMiddleware(...middlewares))
)

export const persistor = persistStore(store, undefined, () => {
  process.env.NODE_ENV === 'development' && console.log('rehydration complete')
})

// Enable accessing Redux store from browser console.
if (process.env.NODE_ENV === 'development' && typeof window === 'object') {
  global.store = store
}

export default store
