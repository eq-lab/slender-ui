'use client'

import React, { useEffect } from 'react'
import { tokens, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { WalletContext } from '@/entities/wallet/context/context'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'

export function PositionSection() {
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)

  const debtBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].debtAddress),
    userAddress,
  )
  const lendBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].sAddress),
    userAddress,
  )

  const sorobanTokenRecordToPositionCell = (
    tokenRecord: SorobanTokenRecord,
    index: number,
  ): PositionCell => ({
    value: Number(tokenRecord.balance) / 10 ** tokenRecord.decimals,
    token: SUPPORTED_TOKENS[index]!,
  })

  // TODO move to provider
  useEffect(() => {
    const debtPositions = debtBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance))
          resultArr.push(sorobanTokenRecordToPositionCell(currentItem, currentIndex))
        return resultArr
      },
      [],
    )

    const lendPositions = lendBalances?.reduce(
      (resultArr: PositionCell[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance))
          resultArr.push(sorobanTokenRecordToPositionCell(currentItem, currentIndex))
        return resultArr
      },
      [],
    )

    // TODO remove if, don't render empty lists
    if (debtPositions?.length || lendPositions?.length) {
      setPosition({
        deposits: lendPositions as [PositionCell, ...PositionCell[]],
        debts: debtPositions || [],
      })
    }
  }, [userAddress, setPosition, debtBalances, lendBalances])

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

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
                  <button type="button" onClick={() => openLendIncreaseModal(token)}>
                    +
                  </button>
                </div>
              )
            })}
            <button type="button" onClick={() => openLendIncreaseModal()}>
              + lend more
            </button>
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
              <button type="button" onClick={() => openBorrowIncreaseModal()}>
                + debt more
              </button>
            </div>
          </div>
        </div>
      ) : (
        'No positions'
      )}
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
      {lendIncreaseModal}
    </div>
  )
}
