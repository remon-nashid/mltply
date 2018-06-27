// @flow

import React from 'react'
import { createStackNavigator } from 'react-navigation'

import ScreenTemplate from '../ScreenTemplate'
import ManualAssetsSection from './ManualAssetsSection'
import TokenPickerScreen from '../TokenPickerScreen'
import { HR } from '../misc'

const Screen = ({ navigation }: { navigation: any }) => (
  <ScreenTemplate>
    <ManualAssetsSection navigation={navigation} />
    <HR />
  </ScreenTemplate>
)

export default createStackNavigator(
  {
    AssetsHome: {
      screen: Screen
    },
    TokenPicker: {
      screen: TokenPickerScreen,
      path: '/tokenPicker'
    }
  },
  { headerMode: 'none' }
)
