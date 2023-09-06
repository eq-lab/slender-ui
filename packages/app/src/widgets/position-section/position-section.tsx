'use client'

import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { useDebtDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useDebtIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useStakeDecrease } from '@/features/borrow-flow/hooks/use-stake-decrease'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const { modal: debtDecreaseModal, open: openDebtDecreaseModal } = useDebtDecrease()
  const { modal: debtIncreaseModal, open: openDebtIncreaseModal } = useDebtIncrease()
  const { modal: stakeDecreaseModal, open: openStakeDecreaseModal } = useStakeDecrease()

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
            {position.stakes.map((stake) => {
              if (!stake) return null
              const { type, value } = stake
              return (
                <div key={type}>
                  {value} {type}{' '}
                  <button type="button" onClick={() => openStakeDecreaseModal(type)}>
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
                    <button type="button" onClick={() => openDebtDecreaseModal(type)}>
                      -
                    </button>
                    <button type="button" onClick={() => openDebtIncreaseModal(type)}>
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
      {debtDecreaseModal}
      {debtIncreaseModal}
      {stakeDecreaseModal}
    </div>
  )
}
