// @flow

import { _symbolSelector } from './_stateSelectors'
import type { Asset } from './assets'
export const groupAssetsBySymbolReducer = (acc: Array<Asset>, asset) => {
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

export const appendPercentageMapper = (totalBalance: number) => {
  return function(asset: Asset) {
    return {
      ...asset,
      percentage: (asset.inBaseFiat * 100) / totalBalance
    }
  }
}

export const appendTokenDetailsMapper = exchangeRates => {
  return ({ sourceId, symbol, amount }: Asset) => {
    const tokenDetails = _symbolSelector(exchangeRates, symbol)
    return {
      symbol,
      amount,
      price: tokenDetails.price,
      inBaseFiat: tokenDetails.price * amount,
      history: tokenDetails.history
    }
  }
}

export const appendHistoricalAmountMapper = (asset: Asset) => {
  console.log(asset)
  if ('history' in asset && asset.history !== undefined) {
    asset.historicalBalance = Object.keys(asset.history).reduce((acc, key) => {
      acc[key] = (asset.inBaseFiat * 100) / (100 + asset.history[key])
      return acc
    }, {})
  }
  return asset
}

export const minAssetBalanceFilter = (minAssetBalance: number) => {
  return (asset: Asset) => {
    return asset.inBaseFiat > minAssetBalance
  }
}

export const totalBalanceReducer = (acc: number = 0, item: Asset) => {
  acc += item.inBaseFiat ? item.inBaseFiat : 0.0
  return acc
}
