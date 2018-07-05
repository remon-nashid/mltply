// @flow

import React from 'react'
import { Text, Footer, FooterTab, Button, Icon } from 'native-base'
import { createBottomTabNavigator } from 'react-navigation'

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import AssetsScreen from './AssetsScreen'
import TargetPortfolioScreen from './TargetPortfolioScreen'

const RouteConfigs = {
  Portfolio: HomeScreen,
  Assets: AssetsScreen,
  TargetPortfolio: TargetPortfolioScreen,
  Settings: SettingsScreen
}

const RouteIconsMap = {
  Portfolio: <Icon type="MaterialCommunityIcons" name="chart-donut" />,
  Assets: <Icon type="MaterialCommunityIcons" name="coins" />,
  TargetPortfolio: <Icon type="MaterialCommunityIcons" name="target" />,
  Settings: <Icon type="MaterialCommunityIcons" name="settings" />
}

export default createBottomTabNavigator(RouteConfigs, {
  initialRouteName: 'TargetPortfolio',
  tabBarComponent: props => {
    return (
      <Footer>
        <FooterTab>
          {Object.keys(RouteConfigs).map((key, i) => (
            <Button
              key={i}
              vertical
              active={props.navigation.state.index === i}
              onPress={() =>
                props.navigation.navigate(props.navigation.state.routes[i].key)
              }
            >
              {RouteIconsMap[key]}
              <Text>{props.navigation.state.routes[i].key}</Text>
            </Button>
          ))}
        </FooterTab>
      </Footer>
    )
  }
})
