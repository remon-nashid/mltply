// @flow

import React from 'react'
import { FlatList } from 'react-native'
import { Text, View } from 'native-base'
import type { Allocation } from '../../ducks/_selectors'

type Props = { allocations: Array<Allocation> }
type State = { allocations: Array<Allocation> }

const Cell = ({ children, style }: { children: any, style?: {} }) => (
  <Text
    style={{
      ...style,
      flex: 1 / 8,
      padding: 5,
      fontFamily: 'Roboto Mono',
      minWidth: 80
    }}
  >
    {children}
  </Text>
)

const Row = ({ children }) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>{children}</View>
)

export default class Table extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { allocations: props.allocations }
  }

  _renderItem({ item }) {
    return (
      <Row>
        <Cell>{item.symbol}</Cell>
        <Cell>{item.amount.toFixed(2)}</Cell>
        <Cell>{item.price.toFixed(2)}</Cell>
        <Cell>{item.value.toFixed(2)}</Cell>
        <Cell>{item.percentage.toFixed(2)}</Cell>
        <Cell>{item.history['1h'].toFixed(2)}</Cell>
        <Cell>{item.history['1d'].toFixed(2)}</Cell>
        <Cell>{item.history['7d'].toFixed(2)}</Cell>
      </Row>
    )
  }

  _header() {
    return (
      <Row>
        <Cell>Symbol</Cell>
        <Cell>Amount</Cell>
        <Cell>Price</Cell>
        <Cell>Value</Cell>
        <Cell>%</Cell>
        <Cell>1h</Cell>
        <Cell>1d</Cell>
        <Cell>7d</Cell>
      </Row>
    )
  }

  render() {
    const { allocations } = this.state
    return (
      <FlatList
        style={
          {
            // width: '100%',
            // flexWrap: 'nowrap'
          }
        }
        data={allocations}
        keyExtractor={(item, index) => item.symbol}
        ListHeaderComponent={this._header}
        renderItem={this._renderItem}
      />
    )
  }
}
