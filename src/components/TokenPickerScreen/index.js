// @flow

import { connect } from 'react-redux'

import TokenPicker from './TokenPicker'

const mapStateToProps = (state, ownProps) => {
  const tokens = Object.keys(state.tokens.data).map(
    key => state.tokens.data[key]
  )

  return {
    tokens,
    exclude: ownProps.navigation.state.params.tokensToExclude || []
  }
}

export default connect(
  mapStateToProps,
  dispatch => {
    return {}
  }
)(TokenPicker)
