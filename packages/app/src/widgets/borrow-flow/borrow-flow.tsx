'use client'

import React, { useState } from 'react'
import { coinInfoByType } from './constants'

import { SingleBorrowFlow } from './components/single-borrow-flow'
import { Position } from './types'
import { BorrowDecreaseModal } from './components/borrow-decrease-modal'
import { BorrowIncreaseModal } from './components/borrow-increase-modal'

const getCollateralUsd = (collateral: Position['collaterals']) => {
  const sum = collateral.reduce((acc, elem) => {
    if (!elem) {
      return acc
    }
    const { type, value } = elem
    const coinInfo = coinInfoByType[type]
    return acc + value * coinInfo.usd
  }, 0)
  return sum
}

export function BorrowFlow() {
  const [position, setPosition] = useState<Position | null>(null)
  const [isDecreaseModalOpen, setIsDecreaseModalOpen] = useState(false)
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false)

  const handleSend = (value: Position) => {
    setPosition(value)
  }

  const handleDecreaseSend = (value: Position) => {
    setPosition(value)
    setIsDecreaseModalOpen(false)
  }

  const handleIncreaseSend = (value: Position) => {
    setPosition(value)
    setIsIncreaseModalOpen(false)
  }

  return (
    <div>
      <div>user xml: {coinInfoByType.xlm.userValue} (FAKE)</div>
      <div>user xrp: {coinInfoByType.xrp.userValue} (FAKE)</div>
      <div>user usdc: {coinInfoByType.usdc.userValue} (FAKE)</div>
      {position && (
        <>
          <h3>Positions</h3>
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
        </>
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
      <SingleBorrowFlow type="usdc" onSend={handleSend} />
      <SingleBorrowFlow type="xlm" onSend={handleSend} />
      <SingleBorrowFlow type="xrp" onSend={handleSend} />
    </div>
  )
}
