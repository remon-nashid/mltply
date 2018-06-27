// @flow

import React from 'react'

import { StyleSheet } from 'react-native'
import { View } from 'native-base'

export const HR = () => (
  <View
    style={{
      padding: 4,
      borderBottomColor: 'black',
      borderBottomWidth: StyleSheet.hairlineWidth
    }}
  />
)
