// @flow

import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Button, ListItem, Icon } from 'native-base'
import ScreenTemplate from '../ScreenTemplate'
import {
  LongPressButton,
  MonoText,
  ErrorMessage,
  SuccessMessage
} from '../misc'

import type { MergedPortfolios } from '../../ducks/_selectors'

type Props = {
  mergedPortfolios?: MergedPortfolios,
  reset: Function,
  navigation: Object,
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
  unallocated: number,
  incrementEnabled: boolean,
  decrementEnabled: boolean,
  editing: boolean,
  edit: Function,
  save: Function
}

const styles = StyleSheet.create({
  columnHeader: { fontWeight: 'bold', flex: 1 }
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
      unallocated,
      max,
      incrementEnabled,
      decrementEnabled,
      editing,
      save,
      edit
    } = this.props

    return (
      <ScreenTemplate>
        {status === 'review' && (
          <ErrorMessage
          >{`Sum of allocations should be 100 (${unallocated}% remaining). Please increment the following allocations, or add a new one.`}</ErrorMessage>
        )}
        {editing &&
          status === 'complete' && (
            <SuccessMessage>
              If you finished editing, press on "save" button to reveal
              rebalancing recommendations.
            </SuccessMessage>
          )}

        {mergedPortfolios &&
          mergedPortfolios.length > 0 && (
            <ListItem style={{ justifyContent: 'space-between' }}>
              <MonoText style={styles.columnHeader}>Symbol</MonoText>
              <MonoText style={styles.columnHeader}>Current (%)</MonoText>
              <MonoText style={styles.columnHeader}>Target (%)</MonoText>
              <MonoText style={styles.columnHeader}>
                {(editing && 'Actions') || 'Recommendation'}
              </MonoText>
            </ListItem>
          )}
        {mergedPortfolios &&
          mergedPortfolios.length > 0 &&
          mergedPortfolios
            .filter(({ inTarget }) => {
              return !editing || inTarget
            })
            .map(({ symbol, target, current, recommendation }) => {
              return (
                <ListItem key={symbol}>
                  <MonoText style={{ flex: 1 }}>{symbol}</MonoText>
                  <MonoText style={{ flex: 1 }}>{current.toString()}</MonoText>
                  <MonoText style={{ flex: 1 }}>{target.toString()}</MonoText>
                  {(editing && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        height: 20
                      }}
                    >
                      <Button
                        transparent
                        disabled={!incrementEnabled}
                        style={{ alignSelf: 'center' }}
                        onPress={() => max(symbol)}
                      >
                        <Text>MAX</Text>
                      </Button>
                      <LongPressButton
                        transparent
                        disabled={!incrementEnabled}
                        style={{ alignSelf: 'center' }}
                        onPressOrHold={() => increment(symbol)}
                      >
                        <Icon type="MaterialCommunityIcons" name="plus" />
                      </LongPressButton>
                      <LongPressButton
                        transparent
                        disabled={!decrementEnabled || target <= 1}
                        style={{ alignSelf: 'center' }}
                        onPressOrHold={() => decrement(symbol)}
                      >
                        <Icon type="MaterialCommunityIcons" name="minus" />
                      </LongPressButton>
                      <Button
                        transparent
                        danger
                        style={{ alignSelf: 'center' }}
                        onPress={() => remove(symbol)}
                      >
                        <Icon type="MaterialCommunityIcons" name="delete" />
                      </Button>
                    </View>
                  )) || (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <MonoText>{recommendation}</MonoText>
                    </View>
                  )}
                </ListItem>
              )
            })}
        {(initiateEnabled && (
          <View
            key="xyz"
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              padding: 15
            }}
          >
            <Button block success onPress={initiate}>
              <Text>Start from current portfolio</Text>
            </Button>
            <Button
              block
              success
              style={{ marginTop: 15 }}
              onPress={() =>
                navigation.navigate('TokenPicker', {
                  selectHandler: this._selectHandler
                })
              }
            >
              <Text>Start from scratch</Text>
            </Button>
          </View>
        )) || (
          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              justifyContent: 'center'
            }}
          >
            {resetEnabled && (
              <Button style={{ margin: 5 }} danger onPress={reset}>
                <Text>RESET</Text>
              </Button>
            )}
            {editing && (
              <Button
                style={{ margin: 5 }}
                success
                onPress={save}
                disabled={status !== 'complete'}
              >
                <Text>SAVE</Text>
              </Button>
            )}
            {!editing && (
              <Button style={{ margin: 5 }} onPress={edit}>
                <Text>EDIT</Text>
              </Button>
            )}
            {editing && (
              <Button
                style={{ margin: 5 }}
                disabled={!addEnabled}
                onPress={() =>
                  navigation.navigate('TokenPicker', {
                    selectHandler: this._selectHandler
                  })
                }
              >
                <Text>ADD TARGET ALLOCATION</Text>
              </Button>
            )}
          </View>
        )}
      </ScreenTemplate>
    )
  }
}
