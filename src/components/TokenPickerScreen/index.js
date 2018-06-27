// @flow

import { connect } from 'react-redux'

import TokenPicker from './TokenPicker'
import { filterTokens } from '../../ducks/tokens'

const mapStateToProps = (state, ownProps) => {
  const tokens = Object.keys(state.tokens.data).map(
    key => state.tokens.data[key]
  )

  return {
    tokens,
    exclude: ownProps.navigation.state.params.tokensToExclude || [],
    // FIXME this is not state
    filterTokens
  }
}

export default connect(
  mapStateToProps,
  dispatch => {
    return {}
  }
)(TokenPicker)
