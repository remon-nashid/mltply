// @flow

import React from 'react'
import { StyleProvider } from 'native-base'
import { Provider as ReduxProvider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import ccxt from 'ccxt'

import Root from './components/Root'
import getTheme from './native-base-theme/components'
import commonColors from './native-base-theme/variables/commonColor'
import store, { persistor } from './reduxStore'
import { fetchResource } from './ducks/tokens'
import { loadBalance, initExchangeProps } from './ducks/exchanges'

const mapStateToProps = state => {
  return {
    baseFiat: state.settings.baseFiat,
    exchanges: state.exchanges.connections
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchResource: (key: string, url: string) =>
      dispatch(fetchResource(key, url)),
    loadBalance: connection => dispatch(loadBalance(connection)),
    initExchangeProps: (ccxt: any) => dispatch(initExchangeProps(ccxt))
  }
}

class App extends React.Component<any> {
  componentDidMount() {
    // Load fiat and crypto exchange rates.
    const {
      fetchResource,
      baseFiat,
      exchanges,
      loadBalance,
      initExchangeProps
    } = this.props
    fetchResource(
      'fiat',
      `https://exchangeratesapi.io/api/latest?base=${baseFiat}`
    )
    for (let i = 0; i < 3; i++) {
      fetchResource(
        'tokens',
        `https://api.coinmarketcap.com/v2/ticker/?start=${i * 100 +
          1}&limit=100&convert=${baseFiat}`
      )
    }

    // Load exchange balances
    exchanges.forEach(connection => loadBalance(connection))

    // Create exchange props array.
    initExchangeProps(ccxt)
  }

  render() {
    return <Root />
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default () => (
  <StyleProvider style={getTheme(commonColors)}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedApp />
      </PersistGate>
    </ReduxProvider>
  </StyleProvider>
)
