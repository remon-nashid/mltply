// @flow

import React from 'react'
import { Button, Icon, Text, View, ListItem } from 'native-base'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'

import AssetEditForm from './AssetEditForm'
import { save, remove } from '../../ducks/assets'

import type { Asset } from '../../ducks/assets'

type Props = {
  navigation: any,
  assets: Array<Asset>,
  save: Function,
  remove: Function
}

type State = {
  toAdd?: string,
  toEdit?: string
}

class Screen extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {}
    this._selectHandler = this._selectHandler.bind(this)
    this._cancelHander = this._cancelHander.bind(this)
    this._saveHandler = this._saveHandler.bind(this)
    this._edit = this._edit.bind(this)
  }
  _selectHandler = function(selected: string) {
    this.props.navigation.goBack()
    this.setState({ toAdd: selected, toEdit: undefined })
  }
  _saveHandler = function(symbol: string, amount: string) {
    this.props.save(symbol, Number(amount))
    this.setState({ toAdd: undefined, toEdit: undefined })
  }
  _cancelHander = function() {
    this.setState({ toAdd: undefined, toEdit: undefined })
  }
  _edit = function(symbol: string) {
    this.setState({ toEdit: symbol })
  }
  render() {
    const { navigation, assets, remove } = this.props
    const { toAdd, toEdit } = this.state

    return (
      <FlatList
        data={assets}
        keyExtractor={(item, index) => item.symbol}
        renderItem={({ item: { symbol, amount } }) => {
          if (symbol !== toEdit) {
            return (
              <ListItem
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{ flex: 1, fontFamily: 'Roboto Mono' }}>
                  {symbol}
                </Text>
                <Text style={{ flex: 1, fontFamily: 'Roboto Mono' }}>
                  {amount}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Button transparent onPress={() => this._edit(symbol)}>
                    <Icon type="MaterialCommunityIcons" name="pencil" />
                  </Button>
                  <Button transparent danger onPress={() => remove(symbol)}>
                    <Icon type="MaterialCommunityIcons" name="delete" danger />
                  </Button>
                </View>
              </ListItem>
            )
          } else {
            return (
              <AssetEditForm
                cancelHandler={this._cancelHander}
                saveHandler={this._saveHandler}
                symbol={symbol}
                amount={amount.toString()}
              />
            )
          }
        }}
        ListFooterComponent={() => {
          const items = []
          if (toAdd) {
            items.push(
              <AssetEditForm
                key={'AddAsset'}
                cancelHandler={this._cancelHander}
                saveHandler={this._saveHandler}
                symbol={toAdd}
              />
            )
          }
          items.push(
            <Button
              block
              key={'TokenPicker'}
              onPress={() =>
                navigation.navigate('TokenPicker', {
                  selectHandler: this._selectHandler,
                  tokensToExclude: assets.map(asset => asset.symbol)
                })
              }
            >
              <Text>Enter an asset manually</Text>
              <Icon type="MaterialCommunityIcons" name="plus" />
            </Button>
          )
          return items
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    assets: state.assets.filter(asset => asset.sourceId === 'manual')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    save: (symbol: string, amount: number) =>
      dispatch(save('manual', symbol, Number(amount))),
    remove: (symbol: string) => dispatch(remove('manual', symbol))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Screen)
