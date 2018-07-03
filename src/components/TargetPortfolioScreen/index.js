// @flow

import { createStackNavigator } from 'react-navigation'

import TokenPickerScreen from '../TokenPickerScreen'
import Screen from './Screen'

export default createStackNavigator(
  {
    TargetPortfolioHome: {
      screen: Screen
    },
    TokenPicker: {
      screen: TokenPickerScreen,
      path: '/tokenPicker'
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
