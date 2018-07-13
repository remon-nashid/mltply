// @flow

import React from 'react'
import { StyleProvider, Root as NBRoot, Toast } from 'native-base'
import { Provider as ReduxProvider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import ccxt from 'ccxt'

import Root from './components/Root'
import getTheme from './native-base-theme/components'
import commonColor from './native-base-theme/variables/commonColor'
import store, { persistor } from './reduxStore'
import { fetchResource } from './ducks/tokens'
import { loadBalance, initExchangeProps } from './ducks/exchanges'
import { removeError } from './ducks/errors'

import config from './config'

const mapStateToProps = state => {
  return {
    baseFiat: state.settings.baseFiat,
    exchanges: state.exchanges.connections,
    error: state.errors
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    initExchangeProps: (ccxt: any) => dispatch(initExchangeProps(ccxt)),
    fetch3P: (exchanges, baseFiat, callback: Function) => {
      Promise.all([
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
    },
    removeError: () => dispatch(removeError())
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

  componentDidUpdate() {
    // Display errors, if any.
    const { error, removeError } = this.props
    if (error) {
      Toast.show({
        duration: 1000000, // Error shall be visible, until dismissed.
        text: error,
        type: 'danger',
        buttonText: 'okay',
        onClose: removeError,
        style: {
          height: 75
        },
        buttonStyle: {
          alignSelf: 'center'
        }
      })
    }
  }

  render() {
    return (
      <NBRoot>
        <Root />
      </NBRoot>
    )
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default () => (
  <StyleProvider style={getTheme(commonColor)}>
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedApp />
      </PersistGate>
    </ReduxProvider>
  </StyleProvider>
)
