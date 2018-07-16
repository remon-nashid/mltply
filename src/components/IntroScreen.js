// @flow

import React from 'react'
import { Button, Text, Icon, View } from 'native-base'
import ScreenTemplate from './ScreenTemplate'

type Props = {
  navigation: Object
}

const FooterIcon = ({ name }: { name: string }) => (
  <Icon
    type="MaterialCommunityIcons"
    name={name}
    style={{
      alignSelf: 'flex-end',
      marginBottom: 6
    }}
  />
)

const routesMap = {
  Portfolio: {
    label: 'Portfolio',
    icon: <FooterIcon name="chart-donut" />,
    desc: 'View summary of your assets.'
  },
  Assets: {
    label: 'Assets',
    icon: <FooterIcon name="coins" />,
    desc:
      'Enter your assets either manually or through a connection to your exchange accounts.'
  },
  TargetPortfolio: {
    label: 'Target Porfolio',
    icon: <FooterIcon name="target" />,
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
            fontSize: 55,
            fontFamily: 'Roboto Mono Medium',
            marginBottom: 20
          }}
        >
          mltply
        </Text>
        <Text>
          Your privacy-oriented, cryptocurrency passive investing tool.
        </Text>

        <View style={{ marginTop: 40, marginBottom: 40, width: '100%' }}>
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
                  alignSelf: 'flex-end',
                  flex: 2,
                  backgroundColor: '#f8f8f8'
                }}
                onPress={() => {
                  navigation.navigate(key)
                }}
              >
                {routesMap[key].icon}
                <Text
                  style={{
                    alignSelf: 'flex-end'
                  }}
                >
                  {routesMap[key].label}
                </Text>
              </Button>
              <Text
                style={{ flex: 3, alignSelf: 'flex-end', paddingBottom: 6 }}
              >
                {routesMap[key].desc}
              </Text>
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
