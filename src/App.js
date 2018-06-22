// @flow

import React from 'react'
import { StyleProvider } from 'native-base'

import Root from './components/Root'
import getTheme from './native-base-theme/components'
import commonColors from './native-base-theme/variables/commonColor'

export default class App extends React.Component<any> {
  render() {
    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Root />
      </StyleProvider>
    )
  }
}
