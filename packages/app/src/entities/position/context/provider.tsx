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
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { Position, PositionCell } from '../types'
import { PositionContext } from './context'

const sorobanTokenRecordToPositionCell = ({
  tokenRecord,
  tokenName,
  cryptocurrencyUsdRates,
  decimals,
  discount,
}: {
  tokenRecord: SorobanTokenRecord
  tokenName: SupportedTokenName
  cryptocurrencyUsdRates?: SupportedTokenRates
  decimals?: number
  discount?: number
}): PositionCell => {
  const denominator = decimals ? 10 ** decimals : 1
  const value = BigInt(tokenRecord.balance ?? 0) / BigInt(denominator)
  const usdRate = cryptocurrencyUsdRates?.[tokenName]

  return {
    value,
    valueInUsd: usdRate && (Number(value) / usdRate) * (discount || 1),
    tokenName,
  }
}

export function PositionProvider({ children }: { children: JSX.Element }) {
  const [position, setPosition] = useState<Position>({
    deposits: [],
    debts: [],
  })
  const [positionUpdate, setPositionUpdate] = useState(0)
  const updatePosition = () => {
    setPositionUpdate((state) => state + 1)
  }
  const { address: userAddress } = useWalletAddress()

  const cryptocurrencyUsdRates = usePriceInUsd()

  const marketData = useMarketData()

  const debtBalances = useGetBalance(
    SUPPORTED_TOKEN_NAMES.map((tokenName) => tokenContracts[tokenName].debtAddress),
  )
  const lendBalances = useGetBalance(
    SUPPORTED_TOKEN_NAMES.map((tokenName) => tokenContracts[tokenName].sAddress),
  )

  const balancesUnderlaying = useGetBalance(
    SUPPORTED_TOKEN_NAMES.map((tokenName) => tokenContracts[tokenName].address),
  )

  useEffect(() => {
    const debtPositions = debtBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          const tokenName = SUPPORTED_TOKEN_NAMES[currentIndex]!
          const { decimals } = balancesUnderlaying[currentIndex] || {}
          resultArr.push(
            sorobanTokenRecordToPositionCell({
              tokenRecord: currentItem,
              tokenName,
              cryptocurrencyUsdRates,
              decimals,
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
          const { decimals } = balancesUnderlaying[currentIndex] || {}
          resultArr.push(
            sorobanTokenRecordToPositionCell({
              tokenRecord: currentItem,
              tokenName,
              cryptocurrencyUsdRates,
              decimals,
              discount: discountInDecimal,
            }),
          )
        }
        return resultArr
      },
      [],
    )

    setPosition({
      deposits: lendPositions,
      debts: debtPositions,
    })
  }, [
    userAddress,
    setPosition,
    positionUpdate,
    debtBalances,
    lendBalances,
    balancesUnderlaying,
    cryptocurrencyUsdRates,
    marketData,
  ])

  return (
    <PositionContext.Provider value={{ position, setPosition, updatePosition }}>
      {children}
    </PositionContext.Provider>
  )
}
