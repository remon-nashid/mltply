// @flow

import { connect } from 'react-redux'
import {
  _getCurrentPortfolio,
  _getMergedPortfolios,
  _appendRecommendations,
  _getTotalValue
} from '../../ducks/_selectors'

import {
  init,
  reset,
  add,
  remove,
  increment,
  decrement,
  max,
  save,
  edit
} from '../../ducks/targetPortfolio'
import TargetPortfolio from './TargetPortfolio'

const mapStateToProps = state => {
  const {
    assets,
    targetPortfolio,
    tokens: { data },
    settings: { minAssetValue, baseFiat }
  } = state

  const { portfolio, initiateEnabled } = targetPortfolio
  const tokensData = data

  if (initiateEnabled && assets.length > 0) {
    const currentPortfolio = _getCurrentPortfolio(
      assets,
      tokensData,
      minAssetValue
    )
    if (Object.values(currentPortfolio).length > 0) {
      // this one includes (<% 1 group) when assets are empty
      return { ...targetPortfolio, currentPortfolio }
    }
  }

  const totalValue = _getTotalValue(assets, tokensData, minAssetValue)

  let mergedPortfolios = _getMergedPortfolios(
    assets,
    tokensData,
    minAssetValue,
    portfolio
  )

  if (targetPortfolio.status === 'complete')
    mergedPortfolios = _appendRecommendations(
      mergedPortfolios,
      totalValue,
      tokensData,
      baseFiat
    )

  return { ...targetPortfolio, initiateEnabled: false, mergedPortfolios }
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
    max: (symbol: string) => dispatch(max(symbol)),
    save: () => dispatch(save()),
    edit: () => dispatch(edit())
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
