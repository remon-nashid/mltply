// @flow

import React, { PureComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { View, Text, Button, ListItem, Icon } from 'native-base'
import ScreenTemplate from '../ScreenTemplate'
import { LongPressButton, MonoText, ErrorMessage } from '../misc'

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
  decrementEnabled: boolean,
  editing: boolean,
  edit: Function,
  save: Function
}

const styles = StyleSheet.create({
  review: { backgroundColor: 'rgba(255, 255, 0, 0.2)' },
  complete: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
  empty: { backgroundColor: 'rgba(0, 0, 0, 0.0)' },
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
      <ScreenTemplate style={(editing && styles[status]) || {}}>
        <View>
          <Text style={{ margin: 10 }}>{``}</Text>
          {status === 'review' && (
            <ErrorMessage
            >{`Sum of allocations should be 100%. ${unallocated}% remains`}</ErrorMessage>
          )}

          {mergedPortfolios && (
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
            mergedPortfolios.map(
              ({ symbol, target, inTarget, current, recommendation }) => {
                return (
                  <ListItem
                    style={{
                      // otherwise height will differ between editing and recommendation modes.
                      height: 50
                    }}
                    key={symbol}
                  >
                    <MonoText
                      style={{
                        flex: 1,
                        color:
                          inTarget || !editing ? 'black' : 'rgba(0,0,0, 0.3)'
                      }}
                    >
                      {symbol}
                    </MonoText>
                    <MonoText
                      style={{
                        flex: 1,
                        color:
                          inTarget || !editing ? 'black' : 'rgba(0,0,0, 0.3)'
                      }}
                    >
                      {current.toString()}
                    </MonoText>
                    <MonoText
                      style={{
                        flex: 1,
                        color:
                          inTarget || !editing ? 'black' : 'rgba(0,0,0, 0.3)'
                      }}
                    >
                      {target.toString()}
                    </MonoText>

                    {(editing && (
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
                          disabled={
                            !inTarget || !decrementEnabled || target <= 1
                          }
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
                    )) || (
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <MonoText>{recommendation}</MonoText>
                      </View>
                    )}
                  </ListItem>
                )
              }
            )}
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
            {initiateEnabled && (
              <Button style={{ margin: 5 }} onPress={initiate}>
                <Text>COPY CURRENT PORTFOLIO</Text>
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
                <Text>ADD ALLOCATION</Text>
              </Button>
            )}
          </View>
        </View>
      </ScreenTemplate>
    )
  }
}
