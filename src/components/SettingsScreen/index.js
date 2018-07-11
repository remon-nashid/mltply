// @flow

import { connect } from 'react-redux'
import { fetchResource } from '../../ducks/tokens'

import SettingsForm from './SettingsForm'
import { saveSetting } from '../../ducks/settings'
import config from '../../config'

const mapStateToProps = state => {
  const {
    settings: { baseFiat, minAssetValue }
  } = state
  return {
    baseFiat,
    minAssetValue
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleMinimumBalanceChange: (key: string, value: string) => {
      dispatch(saveSetting(key, value))
    },
    handleBaseFiatValueChange: (key: string, value: string) => {
      dispatch(saveSetting(key, value))
      Promise.all([
        dispatch(
          fetchResource(
            'fiat',
            `https://exchangeratesapi.io/api/latest?base=${value}`
          )
        ),
        ...Array.from(Array(config.cmcPagesN || 10).keys()).map(i =>
          dispatch(
            fetchResource(
              'crypto',
              `https://api.coinmarketcap.com/v2/ticker/?start=${i * 100 +
                1}&limit=100&convert=${value}`
            )
          )
        )
      ])
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsForm)
