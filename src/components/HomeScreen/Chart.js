// @flow
import React from 'react'
import { View } from 'native-base'
import { VictoryPie, VictoryTheme, VictoryLabel } from 'victory-native'

const Chart = ({
  chartData
}: {
  chartData: Array<{ x: string, y: number }>
}) => (
  <View style={{ maxWidth: 480, width: '100%' }}>
    <VictoryPie
      theme={VictoryTheme.material}
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
          fontFamily: 'Roboto Mono, monospace',
          fontSize: 10
        }
      }}
    />
  </View>
)

export default Chart
