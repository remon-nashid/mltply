// @flow

import React from 'react'
import { connect } from 'react-redux'
import { View } from 'native-base'

import { save, remove } from '../../ducks/assets'

import type { Asset } from '../../ducks/assets'

type Props = {
  navigation: any,
  assets: Array<Asset>,
  save: Function,
  remove: Function
}
type State = {}

class Screen extends React.Component<Props, State> {
  render() {
    return <View />
  }
}

const mapStateToProps = state => {
  return {
    assets: state.assets.filter(asset => asset.sourceId !== 'manual')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    save: (sourceId: string, symbol: string, amount: number) =>
      dispatch(save(sourceId, symbol, Number(amount))),
    remove: (sourceId: string, symbol: string) =>
      dispatch(remove(sourceId, symbol))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)
