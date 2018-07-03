// @flow

import React, { PureComponent } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { View, Text, Button } from 'native-base'
import ScreenTemplate from '../ScreenTemplate'
import { LongPressButton } from '../misc'

type Props = {
  portfolio: {},
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
  messages: Array<string>,
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
  constructor(props) {
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
      portfolio,
      initiateEnabled,
      addEnabled,
      messages,
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
          {!!messages.length > 0 &&
            messages.map(item => <Text key={item}>{item}</Text>)}

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
          {status !== 'empty' &&
            portfolio && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{ fontWeight: 'bold', flex: 1 }}>Asset</Text>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>Current</Text>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>Target</Text>
                <Text style={{ fontWeight: 'bold', flex: 1 }}>Actions</Text>
              </View>
            )}
          {portfolio &&
            Object.keys(portfolio).map(key => {
              const { target, inTarget, current } = portfolio[key]
              return (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      color: inTarget ? 'black' : 'rgba(0,0,0, 0.3)'
                    }}
                  >
                    {key}
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
                  <View style={{ flexDirection: 'row' }}>
                    <Button
                      disabled={!inTarget || !incrementEnabled}
                      onPress={() => max(key)}
                    >
                      <Text>MAX</Text>
                    </Button>
                    <LongPressButton
                      disabled={!inTarget || !incrementEnabled}
                      onPressOrHold={() => increment(key)}
                    >
                      <Text>+</Text>
                    </LongPressButton>
                    <LongPressButton
                      disabled={!inTarget || !decrementEnabled || target <= 1}
                      onPressOrHold={() => decrement(key)}
                    >
                      <Text>-</Text>
                    </LongPressButton>
                    <Button disabled={!inTarget} onPress={() => remove(key)}>
                      <Text>REMOVE</Text>
                    </Button>
                  </View>
                </View>
              )
            })}
        </View>

        {status === 'complete' &&
          (recommendations.length > 0 && (
            <FlatList
              data={recommendations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text>{item}</Text>}
            />
          ))}
      </ScreenTemplate>
    )
  }
}
