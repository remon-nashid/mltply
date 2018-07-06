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

import { MonoText } from './misc'
import config from '../../config'

export default ({
  children,
  backButton = false,
  navigation,
  ...props
}: {
  children: React.Node,
  backButton?: boolean,
  navigation?: Object
}) => (
  <Container {...props}>
    <Header>
      {backButton &&
        navigation && (
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon type="MaterialCommunityIcons" name="arrow-left" />
            </Button>
          </Left>
        )}
      <Body>
        <Title>
          <MonoText>{config.appName}</MonoText>
        </Title>
      </Body>
    </Header>
    <Content padder>{children}</Content>
  </Container>
)
