// @flow

import React from 'react'
import { View } from 'native-base'
import { _changePercentageStyle } from '../../theme'
import { NumericText, MonoText } from '../misc'
import type { HistoricalValues } from '../../ducks/_selectors'

export default ({
  totalValue,
  historicalValues,
  baseFiat
}: {
  totalValue: number,
  historicalValues: HistoricalValues,
  baseFiat: string
}) => (
  <View>
    <View style={{ flexDirection: 'row', padding: 15 }}>
      <NumericText style={{ fontSize: 36 }}>{totalValue}</NumericText>
      <MonoText style={{ fontSize: 36 }}>
        {' ' + baseFiat.toUpperCase()}
      </MonoText>
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {Object.keys(historicalValues).map(key => (
        <View
          key={key}
          style={[
            _changePercentageStyle(historicalValues[key].changePercentage),
            { padding: 10 }
          ]}
        >
          <MonoText>{key}</MonoText>
          <NumericText fractionDigits={0}>
            {historicalValues[key].value}
          </NumericText>
          <View>
            <NumericText percentage>
              {historicalValues[key].changePercentage}
            </NumericText>
          </View>
        </View>
      ))}
    </View>
  </View>
)
