// @flow
import React from 'react'
import { Button, Form, Item, Label, Input, Text } from 'native-base'

type Props = {
  symbol: string,
  amount?: string,
  cancelHandler: Function,
  saveHandler: Function
}
type State = { amount?: string }

export default class AssetEditForm extends React.Component<Props, State> {
  textInput: any = null

  constructor(props: Props) {
    super(props)
    this.state = {
      amount: this.props.amount ? this.props.amount : ''
    }
    this.textInput = React.createRef()
  }

  componentDidMount() {
    setTimeout(() => {
      this.textInput.current._root.focus()
    }, 500)
  }

  render() {
    const { cancelHandler, saveHandler, symbol } = this.props
    const { amount } = this.state
    return (
      <Form>
        <Item inlineLabel>
          <Label>Amount of {this.props.symbol}</Label>
          <Input
            placeholder="0.0"
            autoFocus
            keyboardType="numeric"
            ref={this.textInput}
            value={amount}
            onChangeText={(text: string) => {
              // FIXME for some reason plus and minus signs are still
              // accepted despite the expression below.
              const moneyFomat = /^\d+(\.\d+)?$/
              if (moneyFomat.test(text) || text === '') {
                this.setState({ amount: text })
              }
            }}
            onSubmitEditing={() => {
              if (Number(this.state.amount) > 0) {
                saveHandler(symbol, amount)
              }
            }}
          />
          {/* Button is disabled until amount > 0.0 */}
          <Button
            transparent
            disabled={Number(this.state.amount) <= 0}
            onPress={() => saveHandler(symbol, amount)}
          >
            <Text>Save</Text>
          </Button>
          <Button transparent onPress={cancelHandler}>
            <Text>Cancel</Text>
          </Button>
        </Item>
      </Form>
    )
  }
}
