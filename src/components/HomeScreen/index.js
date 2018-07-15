// @flow

import { connect } from 'react-redux'
import {
  getHistorialValues,
  getAllocations,
  getTotalValue
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

  const allocations = getAllocations(assets, tokensData, minAssetValue)

  if (allocations.length === 0) {
    return {
      introScreen: true
    }
  }

  const historicalValues = getHistorialValues(assets, tokensData, minAssetValue)
  const totalValue = getTotalValue(assets, tokensData, minAssetValue)
  const chartData = allocations
    .sort((a, b) => a.percentage - b.percentage)
    .reduce(
      (acc, item) => {
        if (item.percentage < 2 && acc[0].percentage < 5) {
          acc[0].percentage += item.percentage
        } else {
          acc.push(item)
        }
        return acc
      },
      [{ symbol: 'Other', percentage: 0 }]
    )
    .filter(item => !(item.symbol === 'Other' && item.percentage === 0))
    .map(({ symbol, percentage }) => ({ x: symbol, y: percentage }))

  return {
    introScreen: false,
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
