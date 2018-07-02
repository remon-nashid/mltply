// @flow

import { connect } from 'react-redux'
import { _getHistoricalBalances, _getAllocations } from '../../ducks/_selectors'
import Screen from './Screen'

const mapStateToProps = state => {
  const {
    assets,
    settings: { minAssetBalance }
  } = state
  const tokensData = state.tokens.data

  const allocations = _getAllocations(assets, tokensData, minAssetBalance)
  return {
    chartData: allocations.map(({ symbol, percentage }) => ({
      x: symbol,
      y: percentage
    })),
    allocations,
    historicalBalances: _getHistoricalBalances(
      assets,
      tokensData,
      minAssetBalance
    )
  }
}

export default connect(
  mapStateToProps,
  {}
)(Screen)
