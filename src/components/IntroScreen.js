// @flow

import React from 'react'
import { Button, Text, Icon, View } from 'native-base'
import ScreenTemplate from './ScreenTemplate'

type Props = {
  navigation: Object
}

const routesMap = {
  Portfolio: {
    label: 'Portfolio',
    icon: <Icon type="MaterialCommunityIcons" name="chart-donut" />,
    desc: 'View summary of your assets.'
  },
  Assets: {
    label: 'Assets',
    icon: <Icon type="MaterialCommunityIcons" name="coins" />,
    desc:
      'Enter your assets either manually or through a connection to your exchange accounts.'
  },
  TargetPortfolio: {
    label: 'Target Porfolio',
    icon: <Icon type="MaterialCommunityIcons" name="target" />,
    desc:
      'Get trade recommendations to reach your target portfolio allocations.'
  }
}

export default class IntroScreen extends React.PureComponent<Props> {
  render() {
    const { navigation } = this.props
    return (
      <ScreenTemplate
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Text
          style={{
            fontSize: 50,
            fontFamily: 'Roboto_medium',
            marginBottom: 10
          }}
        >
          mltp.ly
        </Text>
        <Text>
          Your privacy-oriented, crytpocurrency passive investing tool.
        </Text>

        <View style={{ marginTop: 40, marginBottom: 40 }}>
          {Object.keys(routesMap).map((key, i) => (
            <View
              key={key}
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Button
                key={i}
                vertical
                active={navigation.state.index === i}
                light
                style={{
                  alignSelf: 'center',
                  flex: 1,
                  backgroundColor: '#f8f8f8'
                }}
                onPress={() => {
                  navigation.navigate(key)
                }}
              >
                {routesMap[key].icon}
                <Text>{routesMap[key].label}</Text>
              </Button>
              <Text style={{ flex: 3 }}>{routesMap[key].desc}</Text>
            </View>
          ))}
        </View>

        <Button
          success
          style={{ margin: 20, alignSelf: 'center' }}
          onPress={() => {
            navigation.navigate('Assets')
          }}
        >
          <Text>Start by tracking some assets</Text>
        </Button>
      </ScreenTemplate>
    )
  }
}
