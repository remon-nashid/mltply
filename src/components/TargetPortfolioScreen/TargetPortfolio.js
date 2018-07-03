// @flow

import React, { PureComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { View, Text, Button, ListItem, Icon } from 'native-base'
import ScreenTemplate from '../ScreenTemplate'
import { LongPressButton } from '../misc'

import type { MergedPortfolios } from '../../ducks/_selectors'

type Props = {
  mergedPortfolios?: MergedPortfolios,
  reset: Function,
  navigation: any,
  add: Function,
  initiate: Function,
  increment: Function,
  decrement: Function,
  remove: Function,
  max: Function,
  initiateEnabled: boolean,
  resetEnabled: boolean,
  addEnabled: boolean,
  status?: string,
  recommendations: Array<string>,
  unallocated: number,
  incrementEnabled: boolean,
  decrementEnabled: boolean
}

const styles = StyleSheet.create({
  review: { backgroundColor: 'rgba(255, 255, 0, 0.2)' },
  complete: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
  empty: { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
})

export default class TargetPortfolio extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this._selectHandler = this._selectHandler.bind(this)
  }

  _selectHandler = function(selected: string) {
    this.props.navigation.goBack()
    this.props.add(selected)
  }
  render() {
    const {
      navigation,
      reset,
      resetEnabled,
      initiate,
      increment,
      decrement,
      remove,
      mergedPortfolios,
      initiateEnabled,
      addEnabled,
      status,
      recommendations,
      unallocated,
      max,
      incrementEnabled,
      decrementEnabled
    } = this.props

    return (
      <ScreenTemplate>
        <View style={styles[status]}>
          <Text style={{ margin: 10 }}>{`Unallocated: ${unallocated}`}</Text>
          {status === 'review' && <Text>Error: should be 100%</Text>}
          <Button
            success
            disabled={!addEnabled}
            onPress={() =>
              navigation.navigate('TokenPicker', {
                selectHandler: this._selectHandler
              })
            }
          >
            <Text>ADD COIN</Text>
          </Button>
          {resetEnabled && (
            <Button danger onPress={reset}>
              <Text>RESET</Text>
            </Button>
          )}
          {initiateEnabled && (
            <Button success onPress={initiate}>
              <Text>INITIATE</Text>
            </Button>
          )}
          {mergedPortfolios && (
            <ListItem>
              <Text style={{ fontWeight: 'bold', flex: 1 }}>Asset</Text>
              <Text style={{ fontWeight: 'bold', flex: 1 }}>Current</Text>
              <Text style={{ fontWeight: 'bold', flex: 1 }}>Target</Text>
              <Text style={{ fontWeight: 'bold', flex: 1 }}>Actions</Text>
            </ListItem>
          )}
          {mergedPortfolios &&
            mergedPortfolios.map(({ symbol, target, inTarget, current }) => {
              return (
                <ListItem
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                  key={symbol}
                >
                  <Text
                    style={{
                      flex: 1,
                      color: inTarget ? 'black' : 'rgba(0,0,0, 0.3)'
                    }}
                  >
                    {symbol}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: inTarget ? 'black' : 'rgba(0,0,0, 0.3)'
                    }}
                  >
                    {current}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: inTarget ? 'black' : 'rgba(0,0,0, 0.3)'
                    }}
                  >
                    {target}
                  </Text>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Button
                      transparent
                      disabled={!inTarget || !incrementEnabled}
                      onPress={() => max(symbol)}
                    >
                      <Text>MAX</Text>
                    </Button>
                    <LongPressButton
                      transparent
                      disabled={!inTarget || !incrementEnabled}
                      onPressOrHold={() => increment(symbol)}
                    >
                      <Icon type="MaterialCommunityIcons" name="plus" />
                    </LongPressButton>
                    <LongPressButton
                      transparent
                      disabled={!inTarget || !decrementEnabled || target <= 1}
                      onPressOrHold={() => decrement(symbol)}
                    >
                      <Icon type="MaterialCommunityIcons" name="minus" />
                    </LongPressButton>
                    <Button
                      transparent
                      danger
                      disabled={!inTarget}
                      onPress={() => remove(symbol)}
                    >
                      <Icon type="MaterialCommunityIcons" name="delete" />
                    </Button>
                  </View>
                </ListItem>
              )
            })}
        </View>

        {recommendations.length > 0 && (
          <FlatList
            data={recommendations}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
        )}
      </ScreenTemplate>
    )
  }
}
