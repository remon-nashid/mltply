// @flow

import React from 'react'
import { Button, Text, Toast } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'
import IntroScreen from '../IntroScreen'
import Chart from './Chart'
import Table from './Table'
import Values from './Values'

import type { Allocation, HistoricalValues } from '../../ducks/_selectors'

type Props = {
  allocations: Array<Allocation>,
  chartData: Array<{ x: string, y: number }>,
  orderBy: string,
  descending: boolean,
  pressHandler: Function,
  totalValue: number,
  baseFiat: string,
  historicalValues: HistoricalValues,
  addAssetsButton: boolean,
  navigation: Object
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
      baseFiat,
      addAssetsButton,
      navigation
    } = this.props

    if (addAssetsButton) {
      return <IntroScreen navigation={navigation} />
    } else {
      return (
        <ScreenTemplate contentContainerStyle={{ alignItems: 'center' }}>
          <Values
            baseFiat={baseFiat}
            totalValue={totalValue}
            historicalValues={historicalValues}
          />
          <Chart chartData={chartData} />
          <Table
            baseFiat={baseFiat}
            orderBy={orderBy}
            descending={descending}
            allocations={allocations}
            pressHandler={pressHandler}
          />
        </ScreenTemplate>
      )
    }
  }
}
