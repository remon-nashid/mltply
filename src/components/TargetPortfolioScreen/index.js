// @flow

import { connect } from 'react-redux'
import {
  _getCurrentPortfolio,
  _getMergedPortfolio,
  _getTradeRecommendations
} from '../../ducks/_selectors'

import {
  save,
  reset,
  add,
  remove,
  increment,
  decrement,
  max
} from '../../ducks/targetPortfolio'
import TargetPortfolioComponent from './TargetPortfolio'

import type { TargetPortfolio } from '../../ducks/targetPortfolio'

const mapStateToProps = state => {
  const {
    assets,
    targetPortfolio,
    settings: { minAssetBalance }
  } = state
  const { status } = targetPortfolio
  const exchangeRates = state.tokens.data

  const currentPortfolio = _getCurrentPortfolio(
    assets,
    exchangeRates,
    minAssetBalance
  )

  if (status === 'empty') {
    if (Object.values(currentPortfolio).length > 0) {
      return {
        ...targetPortfolio,
        initiateEnabled: true,
        currentPortfolio
      }
    }
  }

  let calc = _getMergedPortfolio(
    assets,
    targetPortfolio,
    exchangeRates,
    minAssetBalance
  )

  let recommendations = _getTradeRecommendations(
    assets,
    targetPortfolio,
    exchangeRates,
    minAssetBalance
  )

  return {
    ...targetPortfolio,
    portfolio: calc,
    recommendations
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reset: (targetPortfolio: TargetPortfolio) => dispatch(reset()),
    initiate: (targetPortfolio: TargetPortfolio) =>
      dispatch(save(targetPortfolio)),
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
)(TargetPortfolioComponent)
