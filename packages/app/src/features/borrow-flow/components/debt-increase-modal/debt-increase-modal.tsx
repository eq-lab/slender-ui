import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { ModalLayout } from '../modal-layout'
import { getHealth, getBorrowCapacity } from '../../utils'
import { PositionSummary } from '../position-summary'

interface Props {
  debtSumUsd: number
  stakeSumUsd: number
  onClose: () => void
  type: SupportedToken
  onSend: (value: Partial<Record<SupportedToken, number>>) => void
  debtTypes: SupportedToken[]
}

export function DebtIncreaseModal({
  stakeSumUsd,
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

  useEffect(() => {
    setCoreDebtType(type)
  }, [type])

  const extraDebtType = debtTypes[0] === coreDebtType ? debtTypes[1] : debtTypes[0]

  const actualDebtUsd =
    debtSumUsd +
    Number(value) * mockTokenInfoByType[coreDebtType].usd +
    (extraDebtType ? Number(extraValue) * mockTokenInfoByType[extraDebtType].usd : 0)

  const { health, healthDelta } = getHealth({
    stakeSumUsd,
    actualDebtUsd,
    debtSumUsd,
    actualStakeSumUsd: stakeSumUsd,
  })

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError } = getBorrowCapacity({
    stakeSumUsd,
    actualDebtUsd,
    debtSumUsd,
    actualStakeUsd: stakeSumUsd,
  })

  const debtUsdDelta = actualDebtUsd - debtSumUsd

  const hasExtraDeptType = Boolean(debtTypes[1])
  const defaultBorrowCapacity = Math.max(stakeSumUsd - debtSumUsd, 0)

  const max = Math.floor(defaultBorrowCapacity / mockTokenInfoByType[coreDebtType].usd)

  const secondInputError = false

  const getSaveData = (): Partial<Record<SupportedToken, number>> => {
    const core = { [coreDebtType]: Number(value) }

    if (showExtraInput && extraDebtType) {
      return {
        ...core,
        [extraDebtType]: Number(extraValue),
      }
    }

    return core
  }

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          stakeSumUsd={stakeSumUsd}
          health={health}
          debtUsdDelta={debtUsdDelta}
          healthDelta={healthDelta}
          borrowCapacityError={borrowCapacityError}
        />
      }
      onClose={onClose}
    >
      <h3>How much to borrow</h3>
      <input onChange={(e) => setValue(e.target.value)} type="number" value={value} />
      {coreDebtType}
      {!showExtraInput && (
        <button type="button" onClick={() => setValue(String(max))}>
          max {max}
        </button>
      )}
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
          {extraDebtType}
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
