// @flow

import React from 'react'
import { Text, Footer, FooterTab, Button, Icon } from 'native-base'
import { createBottomTabNavigator } from 'react-navigation'

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import AssetsScreen from './AssetsScreen'
import TargetPortfolioScreen from './TargetPortfolioScreen'

const routeConfigs = {
  Portfolio: HomeScreen,
  Assets: AssetsScreen,
  TargetPortfolio: TargetPortfolioScreen,
  Settings: SettingsScreen
}

const routesMap = {
  Portfolio: {
    label: 'Portfolio',
    icon: <Icon type="MaterialCommunityIcons" name="chart-donut" />
  },
  Assets: {
    label: 'Assets',
    icon: <Icon type="MaterialCommunityIcons" name="coins" />
  },
  TargetPortfolio: {
    label: 'Target Porfolio',
    icon: <Icon type="MaterialCommunityIcons" name="target" />
  },
  Settings: {
    label: 'Settings',
    icon: <Icon type="MaterialCommunityIcons" name="settings" />
  }
}

export default createBottomTabNavigator(routeConfigs, {
  initialRouteName: 'Portfolio',
  tabBarComponent: props => {
    return (
      <Footer
        style={{
          shadowOffset: { width: 0, height: -5 },
          shadowColor: 'black',
          shadowOpacity: 0.2,
          shadowRadius: 5
        }}
      >
        <FooterTab>
          {Object.keys(routeConfigs).map((key, i) => (
            <Button
              key={i}
              vertical
              active={props.navigation.state.index === i}
              onPress={() =>
                props.navigation.navigate(props.navigation.state.routes[i].key)
              }
            >
              {routesMap[key].icon}
              <Text>{routesMap[key].label}</Text>
            </Button>
          ))}
        </FooterTab>
      </Footer>
    )
  }
})
