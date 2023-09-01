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
    if (!elem) {
      return acc
    }
    const { type, value } = elem
    const coinInfo = mockTokenInfoByType[type]
    return acc + value * coinInfo.usd
  }, 0)
  return sum
}

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [isDecreaseModalOpen, setIsDecreaseModalOpen] = useState(false)
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false)

  const handleDecreaseSend = (value: PositionType) => {
    setPosition(value)
    setIsDecreaseModalOpen(false)
  }

  const handleIncreaseSend = (value: PositionType) => {
    setPosition(value)
    setIsIncreaseModalOpen(false)
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
              {position.debt} {position.debtType}{' '}
              <button type="button" onClick={() => setIsDecreaseModalOpen(true)}>
                -
              </button>
              <button type="button" onClick={() => setIsIncreaseModalOpen(true)}>
                +
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>empty</>
      )}
      {isDecreaseModalOpen && position && (
        <BorrowDecreaseModal
          debt={position.debt}
          collateralUsd={getCollateralUsd(position.collaterals)}
          type={position.debtType}
          onClose={() => setIsDecreaseModalOpen(false)}
          onSend={(value) =>
            handleDecreaseSend({
              ...value,
              collaterals: position.collaterals,
            })
          }
        />
      )}
      {isIncreaseModalOpen && position && (
        <BorrowIncreaseModal
          debt={position.debt}
          collateralUsd={getCollateralUsd(position.collaterals)}
          type={position.debtType}
          onClose={() => setIsIncreaseModalOpen(false)}
          onSend={(value) =>
            handleIncreaseSend({
              ...value,
              collaterals: position.collaterals,
            })
          }
        />
      )}
    </div>
  )
}
