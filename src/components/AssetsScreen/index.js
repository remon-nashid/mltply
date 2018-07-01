// @flow

import React from 'react'
import { createStackNavigator } from 'react-navigation'

import ScreenTemplate from '../ScreenTemplate'
import ManualAssetsSection from './ManualAssetsSection'
import ExchangesSection from './ExchangesSection'
import ExchangeFormScreen from './ExchangeFormScreen'
import TokenPickerScreen from '../TokenPickerScreen'

const Screen = ({ navigation }: { navigation: any }) => (
  <ScreenTemplate>
    <ManualAssetsSection navigation={navigation} />
    <ExchangesSection navigation={navigation} />
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
    },
    ExchangeForm: {
      screen: ExchangeFormScreen,
      path: '/exchangeForm'
    }
  },
  {
    headerMode: 'none'
  }
)
