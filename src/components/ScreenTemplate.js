// @flow

import * as React from 'react'
import {
  Container,
  Header,
  Content,
  Body,
  Title,
  Button,
  Icon,
  Left
} from 'native-base'

export default ({
  children,
  backButton = false,
  navigation
}: {
  children: React.Node,
  backButton?: boolean,
  navigation: any
}) => (
  <Container>
    <Header>
      {backButton && (
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon type="MaterialCommunityIcons" name="arrow-left" />
          </Button>
        </Left>
      )}
      <Body>
        <Title>mltply</Title>
      </Body>
    </Header>
    <Content padder>{children}</Content>
  </Container>
)
