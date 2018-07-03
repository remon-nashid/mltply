// @flow
import React from 'react'
import { View } from 'native-base'
import { VictoryPie, VictoryTheme, VictoryLabel } from 'victory-native'
import config from '../../../config'

const Chart = ({
  chartData
}: {
  chartData: Array<{ x: string, y: number }>
}) => (
  <View style={{ maxWidth: 480, width: '100%' }}>
    <VictoryPie
      theme={VictoryTheme.material}
      labels={({ x, y }) => {
        // Avoid displaying overlappig labels for lesser assets.
        return y >= config.chartLabelThreshold ? `${x}\n${y.toFixed(2)}%` : ''
      }}
      data={chartData}
      sortKey="y"
      sortOrder="descending"
      // Ring style
      innerRadius={95}
      // Guarantees non-cropped labels
      // https://github.com/FormidableLabs/victory/issues/669#issuecomment-317295602
      labelComponent={<VictoryLabel renderInPortal />}
      labelRadius={135}
      style={{
        labels: {
          fontFamily: 'Roboto Mono, monospace'
        }
      }}
    />
  </View>
)

export default Chart
