'use client'

import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()

  return (
    <div>
      <div>user xml: {mockTokenInfoByType.xlm.userValue} (FAKE)</div>
      <div>user xrp: {mockTokenInfoByType.xrp.userValue} (FAKE)</div>
      <div>user usdc: {mockTokenInfoByType.usdc.userValue} (FAKE)</div>
      <h2>Positions</h2>
      {position ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div>
            <h4>lend</h4>
            {position.deposits.map((deposit) => {
              if (!deposit) return null
              const { type, value } = deposit
              return (
                <div key={type}>
                  {value} {type}{' '}
                  <button type="button" onClick={() => openLendDecreaseModal(type)}>
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
                const { type, value } = debt
                return (
                  <div key={type}>
                    {value} {type}{' '}
                    <button type="button" onClick={() => openBorrowDecreaseModal(type)}>
                      -
                    </button>
                    <button type="button" onClick={() => openBorrowIncreaseModal(type)}>
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
