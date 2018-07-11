// @flow

import { largestRemainderRound } from '../utils'

import {
  totalBalanceReducer,
  appendPercentageMapper,
  groupAssetsBySymbolReducer,
  appendHistoricalAmountMapper,
  minAssetValueFilter,
  appendTokenDetailsMapper,
  knownSymbolFilter
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
  diff: number,
  recommendation: string
}>

export function _symbolSelector(tokensData: Object = {}, symbol: string) {
  return tokensData.hasOwnProperty(symbol)
    ? tokensData[symbol]
    : // This case should not occur as assets are filtered earlier.
      { price: 0 }
}

export function _getMergedPortfolios(
  assets: Array<Asset>,
  tokensData: {},
  minAssetValue: number,
  portfolio: Object
): MergedPortfolios {
  const currentPortfolio = _getCurrentPortfolio(
    assets,
    tokensData,
    minAssetValue
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

export function _appendRecommendations(
  mergedPortfolios: MergedPortfolios,
  totalValue: number,
  tokensData: {},
  baseFiat: string
): Array<MergedPortfolios> {
  return mergedPortfolios.map(item => {
    const { symbol, diff } = item
    const direction = diff > 0 ? 'Buy' : 'Sell'
    let price = Math.abs((diff * totalValue) / 100)
    let reco
    const tokenObj = _symbolSelector(tokensData, symbol)
    const units = (price / tokenObj.price).toFixed(2)
    reco = diff
      ? `${direction} ${units} ${symbol} for ${price.toFixed(2)} ${baseFiat}`
      : 'none'
    item.recommendation = reco
    return item
  })
}

export function getAssets(
  assets: Array<Asset>,
  symbols: Array<string>
): Array<Asset> {
  return assets.filter(knownSymbolFilter(symbols))
}

export const _groupAssetsBySymbol = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetValue: number
) => {
  return assets
    .reduce(groupAssetsBySymbolReducer, [])
    .map(appendTokenDetailsMapper(tokensData))
    .filter(minAssetValueFilter(minAssetValue))
}

export const _getTotalValue = (assets, tokensData, minAssetValue) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetValue)
  return groupedAssets.reduce(totalBalanceReducer, 0)
}

export const _getAllocations = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetValue: number
): Array<Allocation> => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetValue)
  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)

  return groupedAssets
    .map(appendPercentageMapper(totalValue))
    .map(appendHistoricalAmountMapper)
}

export const _getHistorialValues = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetValue: number
) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetValue)
  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets
    .map(appendPercentageMapper(totalValue))
    .map(appendHistoricalAmountMapper)

  let historicalValues = groupedAssets.reduce(
    (acc, item) => {
      if ('1h' in item) {
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
  minAssetValue: number
) => {
  if (assets.length === 0) return {}
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetValue)
  const totalValue = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets.map(appendPercentageMapper(totalValue))

  const percentages = groupedAssets.map(asset => asset.percentage)
  const roundedPercentages = largestRemainderRound(percentages, 100)
  let currentPortfolio = groupedAssets.reduce((acc, { symbol }, i) => {
    if (roundedPercentages[i] > 0) {
      acc[symbol] = roundedPercentages[i]
    }
    return acc
  }, {})

  return currentPortfolio
}

export const _getAssetsBySourceId = (
  assets: Array<Asset>,
  sourceId: string
): Array<Asset> => {
  return assets
    .filter(asset => asset.sourceId === sourceId)
    .sort((a, b) => a.symbol > b.symbol)
}
