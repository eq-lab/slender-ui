'use client'

import React, { useMemo, useEffect } from 'react'
import { tokens, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { WalletContext } from '@/entities/wallet/context/context'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { useGetCryptocurrencyUsdRates } from '@/entities/currency-rates/hooks/use-get-cryptocurrency-usd-rates'

const sorobanTokenRecordToPositionCell = (tokenRecord: SorobanTokenRecord): PositionCell => ({
  value: Number(tokenRecord.balance) / 10 ** tokenRecord.decimals,
  token: tokenRecord.symbol.substring(1).toLowerCase() as PositionCell['token'],
})

export function PositionSection() {
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const rates = useGetCryptocurrencyUsdRates()

  const debtSupportedTokensArray = useMemo(
    () => SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].debtAddress),
    [],
  )
  const lendSupportedTokensArray = useMemo(
    () => SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].sAddress),
    [],
  )

  const debtBalances = useGetBalance(debtSupportedTokensArray, userAddress)
  const lendBalances = useGetBalance(lendSupportedTokensArray, userAddress)

  useEffect(() => {
    const debtPositions = debtBalances?.reduce((resultArr: PositionCell[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem))
      return resultArr
    }, [])

    const lendPositions = lendBalances?.reduce((resultArr: PositionCell[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem))
      return resultArr
    }, [])

    if (debtPositions?.length || lendPositions?.length)
      setPosition({
        deposits: lendPositions as [PositionCell, ...PositionCell[]],
        debts: debtPositions || [],
      })
  }, [setPosition, debtBalances, lendBalances])

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()

  return (
    <div>
      <h2>Positions</h2>
      {position ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div>
            <h4>lend</h4>
            {position.deposits.map((deposit) => {
              if (!deposit) return null
              const { token, value } = deposit
              return (
                <div key={token}>
                  {value} {token}{' '}
                  <button type="button" onClick={() => openLendDecreaseModal(token)}>
                    -
                  </button>
                </div>
              )
            })}
          </div>
          <div>
            <h4>borrowed</h4>
            <div>
              {position.debts.map((debt) => {
                if (!debt) return null
                const { token, value } = debt
                return (
                  <div key={token}>
                    {value} {token}{' '}
                    <button type="button" onClick={() => openBorrowDecreaseModal(token)}>
                      -
                    </button>
                    <button type="button" onClick={() => openBorrowIncreaseModal(token)}>
                      +
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <>empty</>
      )}
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
    </div>
  )
}
