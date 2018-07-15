// @flow

import React from 'react'
import { Button, Text } from 'native-base'
import ScreenTemplate from './ScreenTemplate'

type Props = {
  navigation: Object
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
        <Text style={{ fontSize: 50, fontFamily: 'Roboto_medium', margin: 10 }}>
          mltp.ly
        </Text>
        <Text>
          Your privacy-oriented, crytpocurrency passive investing tool.
        </Text>
        <Button
          success
          block
          style={{ margin: 20 }}
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
