'use client'

import React, { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { BorrowDecreaseModal } from '@/features/borrow-flow/components/borrow-decrease-modal'
import { BorrowIncreaseModal } from '@/features/borrow-flow/components/borrow-increase-modal'
import { excludeSupportedTokens } from '@/features/borrow-flow/utils'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { getCollateralUsd, getDebtUsd, sumObj } from './utils'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [decreaseModalIndex, setDecreaseModalIndex] = useState<0 | 1 | null>(null)
  const [increaseModalIndex, setIncreaseModalIndex] = useState<0 | 1 | null>(null)

  const getModalData = (modalIndex: 0 | 1 | null) => {
    if (!position || modalIndex === null) return null
    const debt = position.debts[modalIndex]
    if (!debt) return null
    return { debt, availablePosition: position }
  }

  const renderIncreaseModal = () => {
    const modalData = getModalData(increaseModalIndex)
    if (!modalData) return null
    const firstCollateral = modalData.availablePosition.collaterals[0].type
    const secondCollateral = modalData.availablePosition.collaterals[1]?.type
    const secondDebt = modalData.availablePosition.debts[1]?.type

    const getDebtTypes = () => {
      if (secondDebt) {
        return [modalData.debt.type]
      }

      return excludeSupportedTokens(
        secondCollateral ? [firstCollateral, secondCollateral] : [firstCollateral],
      )
    }

    const handleSend = (sendValue: Partial<Record<'usdc' | 'xlm' | 'xrp', number>>) => {
      const prevDebtsObj = modalData.availablePosition.debts.reduce(
        (acc, el) => ({
          ...acc,
          [el.type]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDebtsObj, sendValue)

      const arr = Object.entries(finalDebtsObj).map((entry) => {
        const [key, value] = entry as [SupportedToken, number]
        return {
          type: key,
          value,
        }
      })

      setPosition({
        debts: arr,
        collaterals: modalData.availablePosition.collaterals,
      })
      setIncreaseModalIndex(null)
    }

    return (
      <BorrowIncreaseModal
        debtTypes={getDebtTypes()}
        collateralSumUsd={getCollateralUsd(modalData.availablePosition.collaterals)}
        debtSumUsd={getDebtUsd(modalData.availablePosition.debts)}
        type={modalData.debt.type}
        onClose={() => setIncreaseModalIndex(null)}
        onSend={handleSend}
      />
    )
  }

  const renderDecreaseModal = () => {
    const modalData = getModalData(decreaseModalIndex)
    if (!modalData) return null

    const handleSend = (value: PositionCell) => {
      const sendType = value.type
      const prev = modalData.availablePosition.debts
      const newDebts = prev.map((el) => {
        if (el.type === sendType) {
          return { value: el.value - value.value, type: sendType }
        }
        return el
      })
      setPosition({
        debts: newDebts,
        collaterals: modalData.availablePosition.collaterals,
      })
      setDecreaseModalIndex(null)
    }

    return (
      <BorrowDecreaseModal
        debt={modalData.debt.value}
        debtSumUsd={getDebtUsd(modalData.availablePosition.debts)}
        collateralSumUsd={getCollateralUsd(modalData.availablePosition.collaterals)}
        type={modalData.debt.type}
        onClose={() => setDecreaseModalIndex(null)}
        onSend={handleSend}
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
                    <div key={debt.type}>
                      {debt.value} {debt.type}{' '}
                      <button type="button" onClick={() => setDecreaseModalIndex(index)}>
                        -
                      </button>
                      <button type="button" onClick={() => setIncreaseModalIndex(index)}>
                        +
                      </button>
                    </div>
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
