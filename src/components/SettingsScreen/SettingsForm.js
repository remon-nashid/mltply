// @flow

import React from 'react'
import { Label, Form, Item, Picker } from 'native-base'

import ScreenTemplate from './../ScreenTemplate'

type Props = {
  minAssetValue: number,
  minimumBalanceOptions: Array<number>,
  baseFiat: string,
  baseFiatOptions: Array<string>,
  handleBaseFiatValueChange: Function,
  handleMinimumBalanceChange: Function
}

export default ({
  minAssetValue,
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
            selectedValue={minAssetValue}
            onValueChange={(itemValue, itemIndex) =>
              handleMinimumBalanceChange('minAssetValue', parseFloat(itemValue))
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
