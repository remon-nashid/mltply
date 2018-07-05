// @flow

import { _symbolSelector } from './_selectors'
import type { Asset } from './assets'
import type { Allocation } from './_selectors'

export const groupAssetsBySymbolReducer = (acc: Array<Asset>, asset: Asset) => {
  let i: number = acc.findIndex(item => item.symbol === asset.symbol)
  if (i > -1) {
    acc[i].amount += asset.amount
  } else {
    // Remove 'sourceId' property
    const { sourceId, ...rest } = asset
    acc.push({ ...rest })
  }
  return acc
}

export const appendPercentageMapper = (totalValue: number) => {
  return function(asset: Allocation) {
    return {
      ...asset,
      percentage: (asset.value * 100) / totalValue
    }
  }
}

export const appendTokenDetailsMapper = (tokensData: {}): Allocation => {
  return ({ sourceId, symbol, amount }: Allocation) => {
    const tokenDetails = _symbolSelector(tokensData, symbol)
    return {
      symbol,
      amount,
      price: tokenDetails.price,
      value: tokenDetails.price * amount,
      ...tokenDetails.history
    }
  }
}

export const appendHistoricalAmountMapper = (asset: Asset) => {
  if ('1h' in asset) {
    asset.historicalValue = ['1h', '1d', '7d'].reduce((acc, key) => {
      acc[key] = (asset.value * 100) / (100 + asset[key])
      return acc
    }, {})
  }
  return asset
}

export const minAssetValueFilter = (minAssetValue: number) => {
  return (asset: Asset) => {
    return asset.value > minAssetValue
  }
}

export const totalBalanceReducer = (acc: number = 0, item: Asset) => {
  acc += item.value ? item.value : 0.0
  return acc
}
