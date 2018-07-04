// @flow

import React from 'react'
import { TouchableOpacity, FlatList } from 'react-native'
import { Text, Input, Icon, Item, ListItem } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'

type Props = {
  selectHandler: Function,
  tokens: Array<any>,
  navigation: any,
  exclude: Array<string>,
  filterTokens: Function
}

type State = {
  filter: string
}

export default class TokenPicker extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      filter: ''
    }
  }

  _renderToken(
    name: string,
    symbol: string,
    selectHandler: Function,
    navigation: Object
  ) {
    return (
      <ListItem>
        <TouchableOpacity
          onPress={() => {
            selectHandler(symbol)
            navigation.goBack()
          }}
          style={{ width: '100%' }}
        >
          <Text
            style={{ fontFamily: 'Roboto Mono' }}
          >{`${symbol} - ${name}`}</Text>
        </TouchableOpacity>
      </ListItem>
    )
  }

  render() {
    const { tokens, navigation, filterTokens, exclude } = this.props
    let selectHandler = this.props.navigation.state.params.selectHandler
    const filter = this.state.filter
    const filteredTokens = filterTokens(tokens, filter, exclude)

    return (
      <ScreenTemplate backButton navigation={navigation}>
        <Item>
          <Icon type="MaterialCommunityIcons" name="magnify" />
          <Input
            placeholder="Search..."
            value={filter}
            onChangeText={value => this.setState({ filter: value })}
          />
        </Item>
        <FlatList
          data={filteredTokens}
          keyExtractor={(item, index) => item.symbol}
          renderItem={({ item: { name, symbol } }) => {
            return this._renderToken(name, symbol, selectHandler, navigation)
          }}
        />
      </ScreenTemplate>
    )
  }
}
