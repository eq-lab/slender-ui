import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { Position } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { formatUsd } from '../../formatters'

interface Props {
  debt: number
  debtSumUsd: number
  collateralSumUsd: number
  onClose: () => void
  type: SupportedToken
  onSend: (value: Position['debts']) => void
  debtTypes: SupportedToken[]
}

export function BorrowIncreaseModal({
  collateralSumUsd,
  debt,
  onClose,
  type,
  onSend,
  debtTypes,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtType, setCoreDebtType] = useState<SupportedToken>(type)
  const [isDebtListOpen, setIsDebtListOpen] = useState(false)
  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtDelta = debt + Number(value)

  useEffect(() => {
    setCoreDebtType(type)
  }, [type])

  const debtDeltaUsd = debtSumUsd + Number(value) * mockTokenInfoByType[coreDebtType].usd

  const defaultHealth = Math.max(
    Math.round(collateralSumUsd && (1 - debtSumUsd / collateralSumUsd) * 100),
    0,
  )

  const health = Math.max(
    Math.round(collateralSumUsd && (1 - debtDeltaUsd / collateralSumUsd) * 100),
    0,
  )

  const hasExtraDeptType = Boolean(debtTypes[1])
  const defaultBorrowCapacity = Math.max(collateralSumUsd - debtSumUsd, 0)
  const borrowCapacity = collateralSumUsd - debtDeltaUsd

  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const max = Math.floor(defaultBorrowCapacity / mockTokenInfoByType[coreDebtType].usd)
  const borrowCapacityError = borrowCapacity < 0

  const extraCollateralType = debtTypes[0] === coreDebtType ? debtTypes[1] : debtTypes[0]

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>
        {health}% ({health - defaultHealth}%)
      </div>
      <div>
        Debt {formatUsd(debtDeltaUsd)} ({formatUsd(debtDeltaUsd - debtSumUsd)})
      </div>
      <div>Collateral {formatUsd(collateralSumUsd)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>
        Borrow capacity {formatUsd(borrowCapacityInterface)} (
        {formatUsd(borrowCapacityInterface - defaultBorrowCapacity)})
      </div>
    </div>
  )

  const secondInputError = false

  const getSaveData = (): Position['debts'] => {
    if (coreDebtType === type) {
      return [{ value: debtDelta, type: coreDebtType }]
    }

    return [
      { value: debt, type },
      { value: Number(value), type: coreDebtType },
    ]
  }

  return (
    <ModalLayout infoSlot={infoSlot} onClose={onClose}>
      <h3>How much to borrow</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      <button type="button" onClick={() => setValue(String(max))}>
        max {max}
      </button>
      {!showExtraInput && hasExtraDeptType && (
        <button onClick={() => setIsDebtListOpen((state) => !state)} type="button">
          change collateral
        </button>
      )}
      {isDebtListOpen && !showExtraInput && (
        <div>
          {debtTypes.map((debtType) => {
            if (!debtType) {
              return null
            }
            return (
              <button key={debtType} type="button" onClick={() => setCoreDebtType(debtType)}>
                {mockTokenInfoByType[debtType].userValue} {debtType}{' '}
                {debtType === coreDebtType && '✓'}
              </button>
            )
          })}
        </div>
      )}
      {!showExtraInput && hasExtraDeptType && (
        <div>
          <button onClick={() => setShowExtraInput(true)} type="button">
            add asset
          </button>
        </div>
      )}
      {showExtraInput && (
        <div>
          <input
            style={{ border: secondInputError ? '1px solid red' : '' }}
            type="number"
            value={extraValue}
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
          />
          {extraCollateralType}
        </div>
      )}
      <div>
        <button onClick={() => onSend(getSaveData())} type="button" disabled={borrowCapacityError}>
          Borrow
        </button>
      </div>
    </ModalLayout>
  )
}
