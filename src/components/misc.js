// @flow

import React from 'react'

import { StyleSheet, TouchableHighlight } from 'react-native'
import { View, Text } from 'native-base'

export const HR = () => (
  <View
    style={{
      padding: 4,
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth
    }}
  />
)

export class LongPressButton extends React.PureComponent {
  timer = null
  constructor() {
    super()
    this.timer = null
    this.onPress = this.onPress.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  onPress() {
    this.props.onPress()
    this.timer = setTimeout(this.onPress, 100)
  }

  stopTimer() {
    clearTimeout(this.timer)
  }

  render() {
    const { title, disabled, ...rest } = this.props
    return (
      <TouchableHighlight
        disabled={disabled}
        onPressIn={this.onPress}
        onPressOut={this.stopTimer}
        underlayColor="white"
        {...rest}
      >
        <View style={disabled ? styles.buttonDisabled : styles.button}>
          <Text
            style={disabled ? styles.buttonTextDisabled : styles.buttonText}
          >
            {title.toUpperCase()}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    padding: 8,
    textAlign: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#dfdfdf',
    borderRadius: 2
  },
  buttonTextDisabled: {
    color: '#a1a1a1',
    fontWeight: '500',
    padding: 8,
    textAlign: 'center'
  }
})
