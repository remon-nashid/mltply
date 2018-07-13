// @flow

import { connect } from 'react-redux'
import {
  getHistorialValues,
  getAllocations,
  getTotalValue
} from '../../ducks/_selectors'
import { sort } from '../../ducks/home'
import Screen from './Screen'
import config from '../../config'

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

  const allocations = getAllocations(assets, tokensData, minAssetValue)

  if (allocations.length === 0) {
    return {
      addAssetsButton: true
    }
  }

  const historicalValues = getHistorialValues(assets, tokensData, minAssetValue)
  const totalValue = getTotalValue(assets, tokensData, minAssetValue)
  const chartData = allocations
    .map(({ symbol, percentage }) => ({
      x: symbol,
      y: percentage
    }))
    .reduce(
      (acc, item) => {
        if (
          item.y < config.chartLabelThreshold &&
          acc[0].y < config.chartLabelThreshold
        ) {
          acc[0].y += item.y
        } else {
          acc.push(item)
        }
        return acc
      },
      [{ x: 'Other', y: 0 }]
    )
    .filter(item => !(item.x === 'Other' && item.y === 0))

  return {
    addAssetsButton: false,
    chartData,
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
