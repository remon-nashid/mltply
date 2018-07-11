// @flow

import React from 'react'
import { Label, Form, Item, Picker } from 'native-base'

import ScreenTemplate from './../ScreenTemplate'
import config from '../../config'

type Props = {
  minAssetValue: number,
  baseFiat: string,
  handleBaseFiatValueChange: Function,
  handleMinimumBalanceChange: Function
}

export default ({
  minAssetValue,
  handleMinimumBalanceChange,
  baseFiat,
  handleBaseFiatValueChange
}: Props) => {
  const baseFiatOptions = config.settings.baseFiatOptions
  const minimumBalanceOptions = config.settings.minimumBalanceOptions
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
