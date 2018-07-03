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
    headerMode: 'none',
    // Prevents StackNavigator from having "backgroundColor: '#E9E9EF'".
    // See https://github.com/react-navigation/react-navigation/issues/2713#issuecomment-338260122
    cardStyle: {
      backgroundColor: 'white'
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent'
      }
    })
  }
)
