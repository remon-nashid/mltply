// @flow

import { connect } from 'react-redux'
import {
  _getCurrentPortfolio,
  _getMergedPortfolios,
  _getTradeRecommendations,
  _getTotalValue
} from '../../ducks/_selectors'

import {
  init,
  reset,
  add,
  remove,
  increment,
  decrement,
  max
} from '../../ducks/targetPortfolio'
import TargetPortfolio from './TargetPortfolio'

const mapStateToProps = state => {
  const {
    assets,
    targetPortfolio,
    tokens: { data },
    settings: { minAssetBalance }
  } = state

  const { portfolio, initiateEnabled } = targetPortfolio
  const tokensData = data

  const currentPortfolio = _getCurrentPortfolio(
    assets,
    tokensData,
    minAssetBalance
  )

  if (initiateEnabled) {
    if (Object.values(currentPortfolio).length > 0) {
      return { ...targetPortfolio, currentPortfolio }
    }
  }

  const totalValue = _getTotalValue(assets, tokensData, minAssetBalance)

  const mergedPortfolios = _getMergedPortfolios(
    assets,
    tokensData,
    minAssetBalance,
    portfolio
  )

  const recommendations =
    targetPortfolio.status === 'complete'
      ? _getTradeRecommendations(mergedPortfolios, totalValue, tokensData)
      : []

  return { ...targetPortfolio, mergedPortfolios, recommendations }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reset: (targetPortfolio: {}) => dispatch(reset()),
    initiate: (targetPortfolio: {}) => dispatch(init(targetPortfolio)),
    increment: (symbol: string) => dispatch(increment(symbol)),
    decrement: (symbol: string) => dispatch(decrement(symbol)),
    remove: (symbol: string) => dispatch(remove(symbol)),
    add: (symbol: string, percentage: number) =>
      dispatch(add(symbol, percentage)),
    max: (symbol: string) => dispatch(max(symbol))
  }
}

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  let mergedProps = {
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps
  }
  if (propsFromState.initiateEnabled) {
    mergedProps.initiate = () =>
      propsFromDispatch.initiate(propsFromState.currentPortfolio)
  }
  return mergedProps
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(TargetPortfolio)
