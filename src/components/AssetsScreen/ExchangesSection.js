// @flow

import React from 'react'
import { connect } from 'react-redux'
import { FlatList } from 'react-native'
import { Button, Text, Icon, View } from 'native-base'

import type { ExchangeConnection } from '../../ducks/exchanges'

type Props = {
  navigation: any,
  connections: Array<ExchangeConnection>,
  save: Function,
  remove: Function
}
type State = {}

class Screen extends React.Component<Props, State> {
  render() {
    const { connections, navigation } = this.props
    return (
      <FlatList
        style={{ marginTop: 15 }}
        data={connections}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => <View />}
        ListFooterComponent={() => {
          return (
            <Button block onPress={() => navigation.navigate('ExchangeForm')}>
              <Text>Connect an exchange</Text>
              <Icon type="MaterialCommunityIcons" name="plus" />
            </Button>
          )
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    connections: state.exchanges.connections
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)
