// @flow

import React from 'react'
import { Text, Footer, FooterTab, Button, Icon } from 'native-base'
import { createBottomTabNavigator } from 'react-navigation'

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'

const AssetsScreen = () => <Text>Assets</Text>
const TargetPortfolioScreen = () => <Text>Target</Text>

const RouteConfigs = {
  Home: HomeScreen,
  Assets: AssetsScreen,
  TargetPortfolio: TargetPortfolioScreen,
  Settings: SettingsScreen
}

const RouteIconsMap = {
  Home: <Icon type="MaterialCommunityIcons" name="home-outline" />,
  Assets: <Icon type="MaterialCommunityIcons" name="coins" />,
  TargetPortfolio: <Icon type="MaterialCommunityIcons" name="target" />,
  Settings: <Icon type="MaterialCommunityIcons" name="settings" />
}

export default createBottomTabNavigator(RouteConfigs, {
  initialRouteName: 'Settings',
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
