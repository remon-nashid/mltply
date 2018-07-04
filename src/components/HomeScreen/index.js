// @flow

import { connect } from 'react-redux'
import {
  _getHistorialValues,
  _getAllocations,
  _getTotalValue
} from '../../ducks/_selectors'
import { sort } from '../../ducks/home'
import Screen from './Screen'

import type { Asset } from '../../ducks/assets'

const mapStateToProps = state => {
  const {
    assets,
    settings: { minAssetBalance, baseFiat },
    home: { orderBy, descending }
  }: {
    assets: Array<Asset>,
    settings: { minAssetBalance: number, baseFiat: string },
    home: { orderBy: string, descending: boolean }
  } = state
  const tokensData: Object = state.tokens.data

  const allocations = _getAllocations(assets, tokensData, minAssetBalance)
  return {
    chartData: allocations.map(({ symbol, percentage }) => ({
      x: symbol,
      y: percentage
    })),
    allocations,
    historicalValues: _getHistorialValues(assets, tokensData, minAssetBalance),
    totalValue: _getTotalValue(assets, tokensData, minAssetBalance),
    orderBy,
    descending,
    baseFiat
  }
}

const mapDispatchToProps = dispatch => {
  return {
    pressHandler: (orderBy: string) => dispatch(sort(orderBy))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)
