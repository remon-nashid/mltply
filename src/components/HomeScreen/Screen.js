// @flow

import React from 'react'
import { Button, Text } from 'native-base'

import ScreenTemplate from '../ScreenTemplate'
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
      return (
        <ScreenTemplate
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <Button
            success
            block
            onPress={() => {
              navigation.navigate('Assets')
            }}
          >
            <Text>Start tracking some assets</Text>
          </Button>
        </ScreenTemplate>
      )
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
