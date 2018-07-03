// @flow

import React, { PureComponent } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { View, Text, Button } from 'native-base'
import type { TargetPortfolio } from '../ducks/targetPortfolio'
import ScreenTemplate from '../ScreenTemplate'
import { LongPressButton } from '../misc'

type Props = {
  portfolio: TargetPortfolio,
  reset: Function,
  navigation: {},
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

function selectHandler(add: Function, percentage: number) {
  return function(selected: string) {
    this.props.navigation.goBack()
    add(selected)
  }
}

const styles = StyleSheet.create({
  review: { backgroundColor: 'rgba(255, 255, 0, 0.2)' },
  complete: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
  empty: { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
})

export default class TargetPortfolioComponent extends PureComponent<Props> {
  render() {
    const {
      navigation,
      reset,
      resetEnabled,
      initiate,
      increment,
      decrement,
      remove,
      add,
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
          <Button
            disabled={!addEnabled}
            onPress={() =>
              navigation.navigate('TokenPicker', {
                selectHandler: selectHandler(add)
              })
            }
          >
            <Text>ADD COIN</Text>
          </Button>
          {resetEnabled && (
            <Button onPress={reset}>
              <Text>RESET</Text>
            </Button>
          )}
          {initiateEnabled && (
            <Button onPress={initiate}>
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
                      onPress={() => increment(key)}
                      title="+"
                    />
                    <LongPressButton
                      disabled={!inTarget || !decrementEnabled || target <= 1}
                      onPress={() => decrement(key)}
                      title="-"
                    />
                    <Button disabled={!inTarget} onPress={() => remove(key)}>
                      <Text>REMOVE</Text>
                    </Button>
                  </View>
                </View>
              )
            })}
        </View>
        {!!messages.length > 0 &&
          messages.map(item => <Text key={item}>{item}</Text>)}

        {status === 'complete' &&
          (recommendations.length > 0 && (
            <FlatList
              data={recommendations}
              renderItem={({ item }) => <Text>{item}</Text>}
            />
          ))}
      </ScreenTemplate>
    )
  }
}
