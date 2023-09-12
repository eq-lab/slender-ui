'use client'

import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'
import { formatUsd } from '@/features/borrow-flow/formatters'
import { PositionCell } from './components/position-cell'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const depositsSumUsd = position?.deposits.reduce(
    (sum, currentCell) => sum + (currentCell.valueInUsd || 0),
    0,
  )

  const debtsSumUsd =
    position?.debts.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

  const positionHealth =
    depositsSumUsd &&
    Math.max(Math.round(depositsSumUsd && (1 - debtsSumUsd / depositsSumUsd) * 100), 0)

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  return (
    <div>
      <h2>Position</h2>
      {position?.deposits.length || position?.debts.length ? (
        <>
          <div>
            <em>Health - {positionHealth}</em>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div>
              {depositsSumUsd && <h2>{formatUsd(depositsSumUsd)}</h2>}
              <h4>Lend</h4>
              {position.deposits.map((deposit) => {
                const { token, valueInUsd } = deposit
                const depositPersentage =
                  valueInUsd && depositsSumUsd
                    ? +Number((valueInUsd / depositsSumUsd) * 100).toFixed(1)
                    : undefined
                return (
                  <PositionCell
                    key={token}
                    position={deposit}
                    persentage={depositPersentage}
                    openDecreaseModal={() => openLendDecreaseModal(token)}
                    openIncreaseModal={() => openLendIncreaseModal(token)}
                    isLendPosition
                  />
                )
              })}
              <button type="button" onClick={() => openLendIncreaseModal()}>
                + lend more
              </button>
            </div>
            <div>
              {debtsSumUsd && <h2>{formatUsd(debtsSumUsd)}</h2>}
              <h4>Borrowed</h4>
              <div>
                {position.debts.map((debt) => {
                  const { token, valueInUsd } = debt
                  const debtPersentage =
                    valueInUsd && debtsSumUsd
                      ? +Number((valueInUsd / debtsSumUsd) * 100).toFixed(1)
                      : undefined

                  return (
                    <PositionCell
                      key={token}
                      position={debt}
                      persentage={debtPersentage}
                      openDecreaseModal={() => openBorrowDecreaseModal(token)}
                      openIncreaseModal={() => openBorrowIncreaseModal(token)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </>
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
