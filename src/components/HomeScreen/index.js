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
    settings: { minAssetValue, baseFiat },
    home: { orderBy, descending }
  }: {
    assets: Array<Asset>,
    settings: { minAssetValue: number, baseFiat: string },
    home: { orderBy: string, descending: boolean }
  } = state
  const tokensData: Object = state.tokens.data

  const allocations = _getAllocations(assets, tokensData, minAssetValue)

  if (allocations.length === 0) {
    return {
      addAssetsButton: true
    }
  }

  const historicalValues = _getHistorialValues(
    assets,
    tokensData,
    minAssetValue
  )
  const totalValue = _getTotalValue(assets, tokensData, minAssetValue)

  return {
    addAssetsButton: false,
    chartData: allocations.map(({ symbol, percentage }) => ({
      x: symbol,
      y: percentage
    })),
    allocations,
    historicalValues,
    totalValue,
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
