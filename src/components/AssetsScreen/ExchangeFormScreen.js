// @flow

import React from 'react'
import { connect } from 'react-redux'
import {
  Form,
  Picker,
  Item,
  Label,
  Text,
  Input,
  Button,
  View
} from 'native-base'
import uuidv4 from 'uuid/v4'

import { authenticate } from '../../ducks/exchanges'
import ScreenTemplate from '../ScreenTemplate'

import type {
  ExchangeProps,
  ExchangeConnection,
  ExchangeCredentials
} from '../../ducks/exchanges'

type Props = {
  navigation: any,
  options: Array<{ label: string, value: string }>,
  exchangeProps: Array<ExchangeProps>,
  authenticate: Function
}

type State = {
  selected: number,
  credentials: {
    apiKey: string | false,
    secret: string | false,
    uid: string | false,
    login: string | false,
    password: string | false,
    twofa: string | false
  }
}

const labelsMap = {
  apiKey: 'Public API Key',
  secret: 'Private Secret Key',
  uid: 'User ID',
  login: 'User Account',
  password: 'Password',
  twofa: '2FA'
}

class ExchangesFormScreen extends React.Component<Props, State> {
  exchangeProps: Array<ExchangeProps>
  initialState: {
    selected: -1,
    credentials: {
      apiKey: false,
      secret: false,
      uid: false,
      login: false,
      password: false,
      twofa: false
    }
  }
  constructor(props: Props) {
    super(props)
    this.exchangeProps = this.props.exchangeProps

    this.state = {
      selected: -1,
      credentials: {
        apiKey: false,
        secret: false,
        uid: false,
        login: false,
        password: false,
        twofa: false
      }
    }
    this._selectExchange = this._selectExchange.bind(this)
    this._handleValChange = this._handleValChange.bind(this)
    this._authenticate = this._authenticate.bind(this)
    this._goodCredentials = this._goodCredentials.bind(this)
  }

  _selectExchange = function(id: number) {
    id = Number(id)
    if (id === -1 && id === this.state.selected) {
      const stateNext = {
        selected: id,
        credentials: this.exchangeProps[id].requiredCredentials
      }
      this.setState(stateNext)
    }
  }

  _handleValChange = function(key: string) {
    return function(val: string) {
      let stateNext = { ...this.state }
      stateNext.credentials[key] = val
      this.setState(stateNext)
    }.bind(this)
  }

  _authenticate = function() {
    const selected = this.state.selected
    const slug = this.exchangeProps[selected].slug
    const credentials = this._goodCredentials(this.state.credentials)
    const connection = { id: uuidv4(), slug, credentials }
    this.props.authenticate(connection)
  }

  _goodCredentials = function(
    credentials: ExchangeCredentials
  ): ExchangeCredentials {
    let ret = Object.keys(credentials)
      .filter(key => credentials[key] !== false)
      .reduce((acc, key) => {
        acc[key] = credentials[key]
        return acc
      }, {})
    return ret
  }

  render() {
    const { navigation, options } = this.props
    const { selected, credentials } = this.state

    return (
      <ScreenTemplate backButton navigation={navigation}>
        <Form>
          <Item inlineLabel>
            <Label style={{ flex: 1 }}>
              <Text>Exchange</Text>
            </Label>
            <Picker
              style={{ flex: 1 }}
              mode="dialog"
              prompt="Select exchange"
              selectedValue={this.state.selected}
              onValueChange={this._selectExchange}
            >
              <Picker.Item
                key={'unselectable'}
                label={'-- Select exchange --'}
                value={-1}
              />
              {options.map(({ label, value }) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>
          </Item>

          {Object.keys(this._goodCredentials(credentials)).map(key => (
            <Item fixedLabel key={key}>
              <Label style={{ flex: 1 }}>
                <Text>{labelsMap[key] + ' *'}</Text>
              </Label>
              <Input
                style={{ flex: 3 }}
                placeholder={labelsMap[key]}
                onChangeText={this._handleValChange(key)}
                value={
                  typeof credentials[key] == 'string' ? credentials[key] : ''
                }
              />
            </Item>
          ))}

          {selected !== -1 && (
            <View
              style={{
                flexDirection: 'row',
                padding: 15,
                justifyContent: 'center'
              }}
            >
              <Button
                success
                style={{ marginRight: 5 }}
                onPress={this._authenticate}
              >
                <Text>Connect</Text>
              </Button>
              <Button light style={{ marginLeft: 5 }}>
                <Text>Cancel</Text>
              </Button>
              <Button />
            </View>
          )}
        </Form>
      </ScreenTemplate>
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.exchanges.props.map((exProps, i) => {
      return { value: i, label: exProps.name }
    }),
    exchangeProps: state.exchanges.props
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authenticate: (connection: ExchangeConnection) =>
      dispatch(authenticate(connection))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangesFormScreen)
