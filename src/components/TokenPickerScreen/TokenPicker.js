// @flow

import React from 'react'
import { TouchableOpacity, FlatList } from 'react-native'
import { Text, Input, Icon, Item, ListItem } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'
import { filterTokens } from '../../ducks/tokens'

type Props = {
  selectHandler: Function,
  tokens: Array<any>,
  navigation: any,
  exclude: Array<string>
}

type State = {
  filter: string
}

export default class TokenPicker extends React.PureComponent<Props, State> {
  _sub: Object
  searchBar: any
  constructor(props: Props) {
    super(props)
    this.state = { filter: '' }
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    this._sub = this.props.navigation.addListener('didFocus', payload => {
      this.searchBar.current._root.focus()
    })
  }
  componentWillUnmount() {
    this._sub.remove()
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
    const { tokens, navigation, exclude } = this.props
    let selectHandler = this.props.navigation.state.params.selectHandler
    const filter = this.state.filter
    const filteredTokens = filterTokens(tokens, filter, exclude)

    return (
      <ScreenTemplate backButton navigation={navigation}>
        <Item>
          <Icon type="MaterialCommunityIcons" name="magnify" />
          <Input
            ref={this.searchBar}
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
