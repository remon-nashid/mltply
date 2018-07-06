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
import { LoadingScreen } from './components/misc'
import config from '../config'

const mapStateToProps = state => {
  return {
    baseFiat: state.settings.baseFiat,
    exchanges: state.exchanges.connections
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    initExchangeProps: (ccxt: any) => dispatch(initExchangeProps(ccxt)),
    fetch3P: (exchanges, baseFiat, callback: Function) => {
      Promise.all([
        dispatch(
          fetchResource(
            'fiat',
            `https://exchangeratesapi.io/api/latest?base=${baseFiat}`
          )
        ),
        ...Array.from(Array(config.cmcPagesN || 10).keys()).map(i =>
          dispatch(
            fetchResource(
              'crypto',
              `https://api.coinmarketcap.com/v2/ticker/?start=${i * 100 +
                1}&limit=100&convert=${baseFiat}`
            )
          )
        ),
        ...exchanges.map(connection => {
          dispatch(loadBalance(connection))
        })
      ]).then(() => callback())
    }
  }
}

type State = {
  loading: boolean
}
class App extends React.Component<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    const { baseFiat, exchanges, initExchangeProps } = this.props

    this.props.fetch3P(exchanges, baseFiat, () => {
      this.setState({ loading: false })
    })

    // Create exchange props array.
    initExchangeProps(ccxt)
  }

  render() {
    if (this.state.loading) return <LoadingScreen />
    else return <Root />
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
