'use client'

import React, { useState, useEffect } from 'react'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { tokenContracts, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { usePriceInUsd, SupportedTokenRates } from '@/entities/currency-rates/context/hooks'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { Position, PositionCell } from '../types'
import { PositionContext } from './context'

const sorobanTokenRecordToPositionCell = (
  tokenRecord: SorobanTokenRecord,
  index: number,
  cryptocurrencyUsdRates: SupportedTokenRates,
): PositionCell => {
  const value = Number(tokenRecord.balance) / 10 ** tokenRecord.decimals
  const token = SUPPORTED_TOKENS[index]!
  const usdRate = cryptocurrencyUsdRates?.[token]

  return {
    value: BigInt(tokenRecord.balance) / 10n ** BigInt(tokenRecord.decimals),
    valueInUsd: usdRate && value * usdRate,
    token,
  }
}

export function PositionProvider({ children }: { children: JSX.Element }) {
  const [position, setPosition] = useState<Position>()
  const { address: userAddress } = useWalletAddress()

  const cryptocurrencyUsdRates = usePriceInUsd()

  const debtBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokenContracts[tokenName].debtAddress),
  )
  const lendBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokenContracts[tokenName].sAddress),
  )

  useEffect(() => {
    const debtPositions = debtBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          resultArr.push(
            sorobanTokenRecordToPositionCell(currentItem, currentIndex, cryptocurrencyUsdRates),
          )
        }
        return resultArr
      },
      [],
    )

    const lendPositions = lendBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          resultArr.push(
            sorobanTokenRecordToPositionCell(currentItem, currentIndex, cryptocurrencyUsdRates),
          )
        }
        return resultArr
      },
      [],
    )

    if (lendPositions.length || debtPositions.length) {
      setPosition({
        deposits: [...lendPositions] as [PositionCell, ...PositionCell[]],
        debts: debtPositions || [],
      })
    }
  }, [userAddress, setPosition, debtBalances, lendBalances, cryptocurrencyUsdRates])

  return (
    <PositionContext.Provider value={{ position, setPosition }}>
      {children}
    </PositionContext.Provider>
  )
}
