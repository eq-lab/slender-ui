'use client'

import React, { useState, useEffect } from 'react'
import { useMarketData } from '@/entities/token/context/hooks'
import { getDecimalDiscount } from '@/shared/utils/get-decimal-discount'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import {
  tokenContracts,
  SUPPORTED_TOKEN_NAMES,
  SupportedTokenName,
} from '@/shared/stellar/constants/tokens'
import { usePriceInUsd, SupportedTokenRates } from '@/entities/currency-rates/context/hooks'
import { Position, PositionCell } from '../types'
import { PositionContext } from './context'

const sorobanTokenRecordToPositionCell = ({
  tokenRecord: { balance },
  tokenName,
  cryptocurrencyUsdRates,
  discount = 1,
}: {
  tokenRecord: SorobanTokenRecord
  tokenName: SupportedTokenName
  cryptocurrencyUsdRates?: SupportedTokenRates
  discount?: number
}): PositionCell => {
  const usdRate = cryptocurrencyUsdRates?.[tokenName]

  return {
    value: balance,
    valueInUsd: usdRate
      ? balance
          .div(usdRate)
          .times(discount ?? 1)
          .toNumber()
      : 1,
    tokenName,
  }
}

export function PositionProvider({ children }: { children: JSX.Element }) {
  const [position, setPosition] = useState<Position>({
    deposits: [],
    debts: [],
  })
  const [isPositionFetched, setPositionFetchedStatus] = useState(false)
  const [positionUpdate, setPositionUpdate] = useState(0)
  const updatePosition = () => {
    setPositionUpdate((state) => state + 1)
  }

  const cryptocurrencyUsdRates = usePriceInUsd()

  const marketData = useMarketData()

  const { value: debtBalances, isFetched: debtBalancesIsFetched } = useGetBalance(
    SUPPORTED_TOKEN_NAMES.map((tokenName) => tokenContracts[tokenName].debtAddress),
    positionUpdate,
  )
  const { value: lendBalances, isFetched: lendBalancesIsFetched } = useGetBalance(
    SUPPORTED_TOKEN_NAMES.map((tokenName) => tokenContracts[tokenName].sAddress),
    positionUpdate,
  )

  useEffect(() => {
    setPositionFetchedStatus(debtBalancesIsFetched && lendBalancesIsFetched)

    const debtPositions = debtBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          const tokenName = SUPPORTED_TOKEN_NAMES[currentIndex]!
          resultArr.push(
            sorobanTokenRecordToPositionCell({
              tokenRecord: currentItem,
              tokenName,
              cryptocurrencyUsdRates,
            }),
          )
        }
        return resultArr
      },
      [],
    )

    const lendPositions = lendBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          const tokenName = SUPPORTED_TOKEN_NAMES[currentIndex]!
          const { address } = tokenContracts[tokenName]
          const { discount } = marketData?.[address] || {}
          const discountInDecimal = discount ? getDecimalDiscount(discount) : 1
          resultArr.push(
            sorobanTokenRecordToPositionCell({
              tokenRecord: currentItem,
              tokenName,
              cryptocurrencyUsdRates,
              discount: discountInDecimal,
            }),
          )
        }
        return resultArr
      },
      [],
    )

    setPosition({
      deposits: lendPositions || [],
      debts: debtPositions || [],
    })
  }, [
    cryptocurrencyUsdRates,
    debtBalances,
    debtBalancesIsFetched,
    lendBalances,
    lendBalancesIsFetched,
    marketData,
  ])

  return (
    <PositionContext.Provider value={{ position, setPosition, updatePosition, isPositionFetched }}>
      {children}
    </PositionContext.Provider>
  )
}
