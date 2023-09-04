'use client'

import React, { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { Position as PositionType } from '@/entities/position/types'
import { BorrowDecreaseModal } from '@/features/borrow-flow/components/borrow-decrease-modal'
import { BorrowIncreaseModal } from '@/features/borrow-flow/components/borrow-increase-modal'

const getCollateralUsd = (collateral: PositionType['collaterals']) => {
  const sum = collateral.reduce((acc, elem) => {
    if (!elem) return acc
    const { type, value } = elem
    const coinInfo = mockTokenInfoByType[type]
    return acc + value * coinInfo.usd * coinInfo.discount
  }, 0)
  return sum
}

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [decreaseModalIndex, setDecreaseModalIndex] = useState<0 | 1 | null>(null)
  const [increaseModalIndex, setIncreaseModalIndex] = useState<0 | 1 | null>(null)

  const handleDecreaseSend = (value: PositionType) => {
    setPosition(value)
    setDecreaseModalIndex(null)
  }

  const handleIncreaseSend = (value: PositionType) => {
    setPosition(value)
    setIncreaseModalIndex(null)
  }

  const getModalData = (modalIndex: 0 | 1 | null) => {
    if (!position || modalIndex === null) return null
    const debt = position.debts[modalIndex]
    if (!debt) return null
    return { debt, availablePosition: position }
  }

  const renderIncreaseModal = () => {
    const modalData = getModalData(increaseModalIndex)
    if (!modalData) return null
    return (
      <BorrowIncreaseModal
        debt={modalData.debt.value}
        collateralUsd={getCollateralUsd(modalData.availablePosition.collaterals)}
        type={modalData.debt.type}
        onClose={() => setIncreaseModalIndex(null)}
        onSend={(value) =>
          handleIncreaseSend({
            debts: value,
            collaterals: modalData.availablePosition.collaterals,
          })
        }
      />
    )
  }

  const renderDecreaseModal = () => {
    const modalData = getModalData(decreaseModalIndex)
    if (!modalData) return null
    return (
      <BorrowDecreaseModal
        debt={modalData.debt.value}
        collateralUsd={getCollateralUsd(modalData.availablePosition.collaterals)}
        type={modalData.debt.type}
        onClose={() => setDecreaseModalIndex(null)}
        onSend={(value) =>
          handleDecreaseSend({
            debts: value,
            collaterals: modalData.availablePosition.collaterals,
          })
        }
      />
    )
  }

  return (
    <div>
      <div>user xml: {mockTokenInfoByType.xlm.userValue} (FAKE)</div>
      <div>user xrp: {mockTokenInfoByType.xrp.userValue} (FAKE)</div>
      <div>user usdc: {mockTokenInfoByType.usdc.userValue} (FAKE)</div>
      <h2>Positions</h2>
      {position ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div>
            <h4>lent</h4>
            {position.collaterals.map((collateral) => {
              if (!collateral) return null
              const { type, value } = collateral
              return (
                <div key={type}>
                  {value} {type}
                </div>
              )
            })}
          </div>
          <div>
            <h4>borrowed</h4>
            <div>
              {position.debts.map((debt, index) => {
                if (!debt) return null
                if (index === 0 || index === 1) {
                  return (
                    <>
                      {debt.value} {debt.type}{' '}
                      <button type="button" onClick={() => setDecreaseModalIndex(index)}>
                        -
                      </button>
                      <button type="button" onClick={() => setIncreaseModalIndex(index)}>
                        +
                      </button>
                    </>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      ) : (
        <>empty</>
      )}
      {renderDecreaseModal()}
      {renderIncreaseModal()}
    </div>
  )
}
