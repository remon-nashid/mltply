// @flow

import React from 'react'
import { Container, Header, Content, Footer, StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'
import material from '../native-base-theme/variables/material'

export default class App extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header />
          <Content />
          <Footer />
        </Container>
      </StyleProvider>
    )
  }
}
