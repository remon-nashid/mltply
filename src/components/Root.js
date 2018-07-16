// @flow

import React from 'react'
import { Text, Footer, FooterTab, Button, Icon } from 'native-base'
import { createBottomTabNavigator } from 'react-navigation'

import HomeScreen from './HomeScreen'
import AssetsScreen from './AssetsScreen'
import TargetPortfolioScreen from './TargetPortfolioScreen'
import SettingsScreen from './SettingsScreen'
import AboutScreen from './AboutScreen'

const routeConfigs = {
  Portfolio: HomeScreen,
  Assets: AssetsScreen,
  TargetPortfolio: TargetPortfolioScreen,
  Settings: SettingsScreen,
  About: AboutScreen
}

const routesMap = {
  Portfolio: {
    label: 'Portfolio',
    iconName: 'chart-donut'
  },
  Assets: {
    label: 'Assets',
    iconName: 'coins'
  },
  TargetPortfolio: {
    label: 'Target Porfolio',
    iconName: 'target'
  },
  Settings: {
    label: 'Settings',
    iconName: 'settings'
  },
  About: {
    label: 'About',
    iconName: 'information-outline'
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
              <Icon
                type="MaterialCommunityIcons"
                name={routesMap[key].iconName}
              />
              <Text>{routesMap[key].label}</Text>
            </Button>
          ))}
        </FooterTab>
      </Footer>
    )
  }
})
