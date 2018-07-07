// @flow

import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Text, View, Button, Icon } from 'native-base'

import { _changePercentageStyle, _formatAmount } from '../../theme'

import type { Allocation } from '../../ducks/_selectors'

type Props = {
  allocations: Array<Allocation>,
  pressHandler: Function,
  orderBy: string,
  descending: boolean
}

const styles = StyleSheet.create({
  container: { flexWrap: 'nowrap', flex: 1 },
  row: {
    flexDirection: 'row',
    borderBottomColor: 'rgba(201,201,201,1.00)',
    borderBottomWidth: 1
  },
  cell: {
    // flex: 1, // similar to "flex: 1 / 8"
    minWidth: 110,
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 5
  },
  text: {
    // wordWrap: 'normal',
    fontFamily: 'Roboto Mono',
    textAlign: 'right'
  }
})

const Cell = ({
  children,
  style,
  KEY,
  textStyle
}: {
  children: any,
  style?: Object,
  KEY: string,
  textStyle?: Object
}) => (
  <View style={[styles.cell, style]}>
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </View>
)

const ChangePercentageCell = ({ children }: { children: any }) => (
  <Cell style={[_changePercentageStyle(children), { minWidth: 70 }]}>
    {children}%
  </Cell>
)

const HeaderCell = ({
  children,
  style,
  KEY,
  orderBy,
  descending,
  pressHandler
}: {
  children: any,
  style: {},
  KEY: string,
  orderBy: string,
  descending: boolean,
  pressHandler: Function
}) => (
  <Button
    transparent
    onPress={() => {
      pressHandler(KEY)
    }}
  >
    <Cell
      style={style}
      textStyle={{ color: orderBy === KEY ? 'black' : 'gray' }}
    >
      {orderBy === KEY &&
        (descending ? (
          <Icon type="MaterialCommunityIcons" name="menu-down" />
        ) : (
          <Icon type="MaterialCommunityIcons" name="menu-up" />
        ))}
      {children}
    </Cell>
  </Button>
)

const Row = ({ children }) => <View style={styles.row}>{children}</View>

export default class Table extends React.PureComponent<Props> {
  _renderItem({ item }) {
    return (
      <Row>
        <Cell style={{ minWidth: 70 }}>{item.symbol}</Cell>
        <Cell>{_formatAmount(item.amount)}</Cell>
        <Cell>{_formatAmount(item.price)}</Cell>
        <Cell>{_formatAmount(item.value)}</Cell>
        <Cell style={{ minWidth: 70 }}>{item.percentage.toFixed(2)}</Cell>
        <ChangePercentageCell>{item['1h']}</ChangePercentageCell>
        <ChangePercentageCell>{item['1d']}</ChangePercentageCell>
        <ChangePercentageCell>{item['7d']}</ChangePercentageCell>
      </Row>
    )
  }

  _header(orderBy: string, descending: boolean, pressHandler: Function) {
    return (
      <Row>
        <Cell style={{ minWidth: 70 }} textStyle={{ color: 'gray' }}>
          Symbol
        </Cell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'amount'}
          descending={descending}
        >
          Amount
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'price'}
          descending={descending}
        >
          Price
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'value'}
          descending={descending}
        >
          Value
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'percentage'}
          descending={descending}
          style={{ minWidth: 70 }}
        >
          %
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'1h'}
          descending={descending}
          style={{ minWidth: 70 }}
        >
          1h
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'1d'}
          descending={descending}
          style={{ minWidth: 70 }}
        >
          1d
        </HeaderCell>
        <HeaderCell
          orderBy={orderBy}
          pressHandler={pressHandler}
          KEY={'7d'}
          descending={descending}
          style={{ minWidth: 70 }}
        >
          7d
        </HeaderCell>
      </Row>
    )
  }

  render() {
    const { orderBy, descending, allocations, pressHandler } = this.props
    return (
      <FlatList
        style={styles.container}
        data={allocations.sort((a, b) => {
          return descending ? b[orderBy] - a[orderBy] : a[orderBy] - b[orderBy]
        })}
        extraData={[orderBy, descending]}
        keyExtractor={(item, index) => item.symbol}
        ListHeaderComponent={() =>
          this._header(orderBy, descending, pressHandler)
        }
        renderItem={this._renderItem}
      />
    )
  }
}
