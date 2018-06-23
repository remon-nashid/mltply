// @flow

import * as React from 'react'
import { Container, Header, Content, Body, Title } from 'native-base'

export default ({ children }: { children: React.Node }) => (
  <Container>
    <Header>
      <Body>
        <Title>mltply</Title>
      </Body>
    </Header>
    <Content>
      <Body>{children}</Body>
    </Content>
  </Container>
)
