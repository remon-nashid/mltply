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
  id?: string | null,
  connection?: ExchangeConnection | null,
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

  constructor(props: Props) {
    super(props)
    this.exchangeProps = this.props.exchangeProps
    const connection = this.props.navigation.getParam('connection')
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

    if (connection) {
      this.state.credentials = Object.assign(
        this.state.credentials,
        connection.credentials
      )
      this.state.id = connection.id
      this.state.selected = -2
      this.state.connection = connection
      this.state.name = connection.name
    }

    this._selectExchange = this._selectExchange.bind(this)
    this._handleValChange = this._handleValChange.bind(this)
    this._authenticate = this._authenticate.bind(this)
    this._filterRequiredCreds = this._filterRequiredCreds.bind(this)
    this._isSavable = this._isSavable.bind(this)
    this._goBack = this._goBack.bind(this)
  }

  _selectExchange = function(selected: number) {
    selected = Number(selected)

    if (selected !== -1 && selected !== this.state.selected) {
      const stateNext = {
        selected,
        credentials: this.exchangeProps[selected].requiredCredentials
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
    let connection
    const credentials = this._filterRequiredCreds(this.state.credentials)
    if (this.state.connection) {
      connection = {
        ...this.state.connection,
        credentials
      }
    } else {
      connection = {
        id: uuidv4(),
        slug: this.exchangeProps[selected].slug,
        name: this.exchangeProps[selected].name,
        credentials
      }
    }
    this.props.authenticate(connection, this.props.navigation)
  }

  _filterRequiredCreds = function(
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

  /**
   * A form is not savable (i.e "CONNECT" button is enabled) if:
   * - An exchange is selected.
   * - No inputs are empty.
   */
  _isSavable = function() {
    return (
      this.state.selected !== -1 &&
      Object.values(this._filterRequiredCreds(this.state.credentials)).find(
        val => val === '' || val === true
      ) === undefined
    )
  }

  _goBack = function() {
    this.props.navigation.goBack()
  }

  render() {
    const { navigation, options } = this.props
    const { selected, credentials, id, name } = this.state
    return (
      <ScreenTemplate backButton navigation={navigation}>
        <Form>
          <Item inlineLabel>
            <Label style={{ flex: 1 }}>
              <Text>Exchange</Text>
            </Label>
            <View style={{ flex: 3 }}>
              {(id && <Text>{name}</Text>) || (
                <Picker
                  mode="dialog"
                  prompt="Select exchange"
                  selectedValue={selected}
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
              )}
            </View>
          </Item>

          {Object.keys(this._filterRequiredCreds(credentials)).map(key => (
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

          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              justifyContent: 'center'
            }}
          >
            <Button
              success
              disabled={!this._isSavable()}
              style={{ marginRight: 5 }}
              onPress={this._authenticate}
            >
              <Text>Connect</Text>
            </Button>
            <Button light style={{ marginLeft: 5 }} onPress={this._goBack}>
              <Text>Cancel</Text>
            </Button>
            <Button />
          </View>
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
    authenticate: (connection: ExchangeConnection, navigation: any) =>
      dispatch(authenticate(connection, navigation))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangesFormScreen)
