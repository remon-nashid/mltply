// @flow

import React from 'react'
import { View } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'
import Chart from './Chart'
import Table from './Table'

import type { Allocation } from '../../ducks/_selectors'

type Props = {
  allocations: Array<Allocation>,
  chartData: Array<{ x: string, y: number }>
}

export default class Screen extends React.PureComponent<Props> {
  render() {
    const { allocations, chartData } = this.props
    return (
      <ScreenTemplate>
        <View style={{ alignItems: 'center' }}>
          <Table allocations={allocations} />
          <Chart chartData={chartData} />
        </View>
      </ScreenTemplate>
    )
  }
}
