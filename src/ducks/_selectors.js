// @flow

import config from '../../config'

import {
  totalBalanceReducer,
  appendPercentageMapper,
  groupAssetsBySymbolReducer,
  appendHistoricalAmountMapper,
  minAssetBalanceFilter,
  appendTokenDetailsMapper
} from '../ducks/_modifiers'

import type { Asset } from './assets'

export type Allocation = {
  symbol: string,
  amount: number,
  price: number,
  value: number,
  percentage: number,
  history: {
    '1h': number,
    '1d': number,
    '7d': number
  }
}

export type HistoricalValue = { value: number, changePercentage: number }

export type HistoricalValues = {
  '1h': HistoricalValue,
  '1d': HistoricalValue,
  '7d': HistoricalValue
}

export type MergedPortfolios = Array<{
  symbol: string,
  target: number,
  current: number,
  inTarget: boolean,
  diff: number
}>

export function _symbolSelector(tokensData: Object = {}, symbol: string) {
  // FIXME
  return tokensData.hasOwnProperty(symbol) ? tokensData[symbol] : { price: 0 }
}

export function _getMergedPortfolios(
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number,
  portfolio: {}
): MergedPortfolios {
  const currentPortfolio = _getCurrentPortfolio(
    assets,
    tokensData,
    minAssetBalance
  )

  let mergedSymbols: Array<string> = [
    ...Object.keys(currentPortfolio),
    ...Object.keys(portfolio)
  ].filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  const calc: MergedPortfolios = []
  mergedSymbols.forEach(symbol => {
    const inTarget = portfolio.hasOwnProperty(symbol)
    const target = portfolio.hasOwnProperty(symbol) ? portfolio[symbol] : 0
    const current = currentPortfolio.hasOwnProperty(symbol)
      ? currentPortfolio[symbol]
      : 0
    const diff = target - current
    calc.push({ symbol, target, current, inTarget, diff })
  })

  return calc
}

export function _getTradeRecommendations(
  mergedPortfolios: MergedPortfolios,
  totalValue: number,
  tokensData: {}
): Array<string> {
  const recommendations = mergedPortfolios.map(({ symbol, diff }) => {
    const direction = diff > 0 ? 'Buy' : 'Sell'
    let price = Math.abs((diff * totalValue) / 100)

    if (symbol === config.targetPortfolio.smallGroup) {
      return diff
        ? `${direction} ${price.toFixed(2)} worth of assets less than %1`
        : ''
    } else {
      const tokenObj = _symbolSelector(tokensData, symbol)
      const units = (price / tokenObj.price).toFixed(2)
      return diff
        ? `${direction} ${units} ${symbol} for ${price.toFixed(2)}`
        : ''
    }
  })

  return recommendations
}

export const _groupAssetsBySymbol = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
) => {
  return assets
    .reduce(groupAssetsBySymbolReducer, [])
    .map(appendTokenDetailsMapper(tokensData))
    .filter(minAssetBalanceFilter(minAssetBalance))
}

export const _getTotalValue = (assets, tokensData, minAssetBalance) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  return groupedAssets.reduce(totalBalanceReducer, 0)
}

export const _getAllocations = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
): Array<Allocation> => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)

  return groupedAssets
    .map(appendPercentageMapper(totalValue))
    .map(appendHistoricalAmountMapper)
}

export const _getHistorialValues = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets
    .map(appendPercentageMapper(totalValue))
    .map(appendHistoricalAmountMapper)

  let historicalValues = groupedAssets.reduce(
    (acc, item) => {
      if (item['1h']) {
        acc['1h'].value += item.historicalValue['1h']
        acc['1d'].value += item.historicalValue['1d']
        acc['7d'].value += item.historicalValue['7d']
      }
      return acc
    },
    {
      '1h': { value: 0 },
      '1d': { value: 0 },
      '7d': { value: 0 }
    }
  )

  // Calculate change percentages.
  historicalValues = Object.keys(historicalValues).reduce(
    (historicalValues, key) => {
      historicalValues[key].changePercentage =
        ((totalValue - historicalValues[key].value) * 100) / totalValue
      return historicalValues
    },
    historicalValues
  )

  return historicalValues
}

export const _getCurrentPortfolio = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)

  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets.map(appendPercentageMapper(totalValue))

  let currentPortfolio = groupedAssets
    .map(({ symbol, percentage }) => {
      return { symbol, percentage: Math.floor(percentage) }
    })
    .filter(({ symbol, percentage }) => percentage > 0)
    .reduce(
      (acc, { symbol, percentage }) => {
        acc[symbol] = percentage
        acc[config.targetPortfolio.smallGroup] =
          acc[config.targetPortfolio.smallGroup] - percentage
        return acc
      },
      { [config.targetPortfolio.smallGroup]: 100 }
    )

  if (currentPortfolio[config.targetPortfolio.smallGroup] === 0) {
    delete currentPortfolio[config.targetPortfolio.smallGroup]
  }

  return currentPortfolio
}
