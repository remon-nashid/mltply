// @flow

import React from 'react'
import { connect } from 'react-redux'
import { FlatList } from 'react-native'
import { Button, Text, Icon, View, ListItem } from 'native-base'
import { deleteConnection } from '../../ducks/exchanges'

import type { ExchangeConnection, ExchangeProps } from '../../ducks/exchanges'

type Props = {
  navigation: any,
  connections: Array<ExchangeConnection>,
  deleteConnection: Function,
  exchangeProps: Array<ExchangeProps>
}
type State = {}

class Screen extends React.Component<Props, State> {
  render() {
    const {
      connections,
      navigation,
      exchangeProps,
      deleteConnection
    } = this.props
    return (
      <FlatList
        style={{ marginTop: 15 }}
        data={connections}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => {
          const props = exchangeProps.find(props => props['slug'] === item.slug)
          if (!props) throw new Error(`Missing props of exchange: ${item.slug}`)
          console.log(props)
          const { name } = props
          const { id } = item

          return (
            <ListItem
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Text style={{ flex: 1 }}>{name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Button transparent onPress={() => this._edit(symbol)}>
                  <Icon type="MaterialCommunityIcons" name="pencil" />
                </Button>
                <Button transparent danger onPress={() => deleteConnection(id)}>
                  <Icon type="MaterialCommunityIcons" name="delete" danger />
                </Button>
              </View>
            </ListItem>
          )
        }}
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
    connections: state.exchanges.connections,
    exchangeProps: state.exchanges.props
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deleteConnection: (id: string) => dispatch(deleteConnection(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)
