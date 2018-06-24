// @flow

import React from 'react'
import { Label, Form, Item, Input, Picker } from 'native-base'

import ScreenTemplate from './ScreenTemplate'

type Props = {
  minAssetBalance: number,
  minimumBalanceOptions: Array<number>,
  baseFiat: string,
  baseFiatOptions: Array<string>,
  handleBaseFiatValueChange: Function,
  handleMinimumBalanceChange: Function
}

export default ({
  minAssetBalance,
  minimumBalanceOptions,
  handleMinimumBalanceChange,
  baseFiat,
  baseFiatOptions,
  handleBaseFiatValueChange
}: Props) => {
  return (
    <ScreenTemplate>
      <Form>
        <Item fixedLabel>
          <Label>Base Currency</Label>
          <Picker
            selectedValue={baseFiat}
            onValueChange={(itemValue, itemIndex) =>
              handleBaseFiatValueChange('baseFiat', itemValue)
            }
          >
            {baseFiatOptions.map(option => (
              <Picker.Item
                key={option}
                label={option.toUpperCase()}
                value={option.toUpperCase()}
              >
                {option}
              </Picker.Item>
            ))}
          </Picker>
        </Item>
        <Item fixedLabel>
          <Label>Minimum Balance ({baseFiat})</Label>
          <Picker
            selectedValue={minAssetBalance}
            onValueChange={(itemValue, itemIndex) =>
              handleMinimumBalanceChange(
                'minAssetBalance',
                parseFloat(itemValue)
              )
            }
          >
            {minimumBalanceOptions.map(option => (
              <Picker.Item
                key={option}
                label={option.toString()}
                value={option}
              >
                {option}
              </Picker.Item>
            ))}
          </Picker>
        </Item>
      </Form>
    </ScreenTemplate>
  )
}
