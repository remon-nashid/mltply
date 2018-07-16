// @flow

import React from 'react'

import { StyleSheet, ActivityIndicator } from 'react-native'
import { View, Text, Button, Card, Content, ListItem } from 'native-base'
// FIXME avoid accessing theme variables directly.
import commonColors from '../native-base-theme/variables/commonColor'

export const HR = () => (
  <View
    style={{
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 10,
      marginBottom: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: StyleSheet.hairlineWidth
    }}
  />
)

export const NumericText = ({
  children,
  fractionDigits = 2,
  percentage = false,
  style
}: {
  children: number,
  fractionDigits?: number,
  percentage?: boolean,
  style?: {}
}) => (
  <Text style={[{ fontFamily: 'Roboto Mono, monospace' }, style]}>
    {children.toLocaleString(undefined, {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits
    })}
    {percentage && '%'}
  </Text>
)

export const MonoText = ({
  children,
  style
}: {
  children: string,
  style?: {}
}) => (
  <Text style={[{ fontFamily: 'Roboto Mono, monospace' }, style]}>
    {children}
  </Text>
)

export const ErrorMessage = ({ children }: { children: string }) => (
  <Card
    style={{
      backgroundColor: commonColors.brandDanger,
      borderColor: '#973a37',
      marginBottom: 20
    }}
  >
    <Content padder>
      <Text style={{ color: 'white' }}>{children}</Text>
    </Content>
  </Card>
)

export const SuccessMessage = ({ children }: { children: string }) => (
  <Card
    style={{
      backgroundColor: commonColors.brandSuccess,
      borderColor: '#468c46',
      marginBottom: 20
    }}
  >
    <Content padder>
      <Text style={{ color: 'white' }}>{children}</Text>
    </Content>
  </Card>
)

export class LongPressButton extends React.PureComponent<{
  onPressOrHold: Function,
  children: any
}> {
  timer = null
  constructor() {
    super()
    this.timer = null
    this._handlePress = this._handlePress.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  _handlePress = function() {
    this.props.onPressOrHold()
    this.timer = setTimeout(this._handlePress, 200)
  }

  stopTimer = function() {
    if (this.timer) clearTimeout(this.timer)
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <Button
        onPressIn={this._handlePress}
        onPressOut={this.stopTimer}
        {...rest}
      >
        {children}
      </Button>
    )
  }
}

export const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
)

export const AssetsListItem = ({ children }: { children: any }) => (
  <ListItem
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 52
    }}
  >
    {children}
  </ListItem>
)
