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

export type HistoricalBalance = { balance: number, changePercentage: number }

export type HistoricalBalances = {
  current: HistoricalBalance,
  tf1h: HistoricalBalance,
  tf1d: HistoricalBalance,
  tf7d: HistoricalBalance
}

export function _symbolSelector(tokensData: Object = {}, symbol: string) {
  // FIXME
  return tokensData.hasOwnProperty(symbol) ? tokensData[symbol] : { price: 0 }
}

export function _getMergedPortfolio(
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number,
  targetPortfolio: {}
) {
  const { portfolio } = targetPortfolio

  const currentPortfolio = _getCurrentPortfolio(
    assets,
    tokensData,
    minAssetBalance
  )

  let mergedSymbols = [
    ...Object.keys(currentPortfolio),
    ...Object.keys(portfolio)
  ].unique()

  const calc = {}
  mergedSymbols.forEach(symbol => {
    const inTarget = portfolio.hasOwnProperty(symbol)
    const target = portfolio.hasOwnProperty(symbol) ? portfolio[symbol] : 0
    const current = currentPortfolio.hasOwnProperty(symbol)
      ? currentPortfolio[symbol]
      : 0
    const diff = target - current
    calc[symbol] = {
      target,
      current,
      inTarget,
      diff
    }
  })

  return calc
}

export function _getTradeRecommendations(
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number,
  targetPortfolio: {}
): Array<string> {
  const calc = _getMergedPortfolio(
    assets,
    tokensData,
    minAssetBalance,
    targetPortfolio
  )

  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  const totalBalance = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets.map(appendPercentageMapper(totalBalance))

  return Object.keys(calc).map(symbol => {
    const { diff } = calc[symbol]

    const direction = diff > 0 ? 'Buy' : 'Sell'
    let price = Math.abs((diff * totalBalance) / 100)

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

export const _getTotalBalance = (assets, tokensData, minAssetBalance) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  return groupedAssets.reduce(totalBalanceReducer, 0)
}

export const _getAllocations = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
): Array<Allocation> => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  const totalBalance = groupedAssets.reduce(totalBalanceReducer, 0)

  return groupedAssets
    .map(appendPercentageMapper(totalBalance))
    .map(appendHistoricalAmountMapper)
}

export const _getHistoricalBalances = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)
  const totalBalance = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets
    .map(appendPercentageMapper(totalBalance))
    .map(appendHistoricalAmountMapper)

  let historicalBalances = groupedAssets.reduce(
    (acc, item) => {
      if (item.history) {
        acc.current.balance += item.value
        acc.tf1h.balance += item.historicalBalance['1h']
        acc.tf1d.balance += item.historicalBalance['1d']
        acc.tf7d.balance += item.historicalBalance['7d']
      }
      return acc
    },
    {
      current: { balance: 0 },
      tf1h: { balance: 0 },
      tf1d: { balance: 0 },
      tf7d: { balance: 0 }
    }
  )

  // Calculate change percentages.
  historicalBalances = Object.keys(historicalBalances).reduce(
    (historicalBalances, key) => {
      if (key !== 'current') {
        historicalBalances[key].changePercentage =
          ((totalBalance - historicalBalances[key].balance) * 100) /
          totalBalance
      }
      return historicalBalances
    },
    historicalBalances
  )

  return historicalBalances
}

export const _getCurrentPortfolio = (
  assets: Array<Asset>,
  tokensData: {},
  minAssetBalance: number
) => {
  let groupedAssets = _groupAssetsBySymbol(assets, tokensData, minAssetBalance)

  const totalBalance = groupedAssets.reduce(totalBalanceReducer, 0)
  groupedAssets = groupedAssets.map(appendPercentageMapper(totalBalance))

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
