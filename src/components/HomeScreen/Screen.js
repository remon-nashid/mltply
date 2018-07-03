// @flow

import React from 'react'
import { View } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'
import Chart from './Chart'
import Table from './Table'
import Values from './Values'

import type { Allocation } from '../../ducks/_selectors'

type Props = {
  allocations: Array<Allocation>,
  chartData: Array<{ x: string, y: number }>,
  orderBy: string,
  descending: boolean,
  pressHandler: Function,
  totalValue: number,
  baseFiat: string
}

export default class Screen extends React.PureComponent<Props> {
  render() {
    const {
      allocations,
      chartData,
      orderBy,
      descending,
      pressHandler,
      historicalValues,
      totalValue,
      baseFiat
    } = this.props

    return (
      <ScreenTemplate>
        <View style={{ alignItems: 'center' }}>
          <Values
            baseFiat={baseFiat}
            totalValue={totalValue}
            historicalValues={historicalValues}
          />
          <Chart chartData={chartData} />
          <Table
            orderBy={orderBy}
            descending={descending}
            allocations={allocations}
            pressHandler={pressHandler}
          />
        </View>
      </ScreenTemplate>
    )
  }
}
