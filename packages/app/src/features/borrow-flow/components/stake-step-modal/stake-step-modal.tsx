import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import {
  APR,
  MINIMUM_HEALTH_VALUE,
  mockTokenInfoByType,
} from '@/shared/stellar/constants/mock-tokens-info'
import { Position } from '@/entities/position/types'
import { ModalLayout } from '../modal-layout'
import { formatUsd } from '../../formatters'

interface Props {
  onClose: () => void
  onPrev?: () => void
  borrowValue: string
  borrowType: SupportedToken
  stakeTypes: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function StakeStepModal({
  onClose,
  onPrev,
  borrowValue,
  borrowType,
  stakeTypes,
  onSend,
}: Props) {
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreStakeType, setCoreStakeType] = useState<SupportedToken>(stakeTypes[0])
  const [isStakeListOpen, setIsStakeListOpen] = useState(false)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const borrowCoinInfo = mockTokenInfoByType[borrowType]
  const coreStakeInfo = mockTokenInfoByType[coreStakeType]
  const extraStakeType = stakeTypes[0] === coreStakeType ? stakeTypes[1] : stakeTypes[0]
  const extraStakeInfo = mockTokenInfoByType[extraStakeType]

  const borrowValueInUSD = Number(borrowValue) * borrowCoinInfo.usd

  useEffect(() => {
    const inputValue = Math.floor(
      borrowValueInUSD / (coreStakeInfo.discount * coreStakeInfo.usd * MINIMUM_HEALTH_VALUE),
    )

    const finalValue = inputValue > coreStakeInfo.userValue ? coreStakeInfo.userValue : inputValue
    setCoreValue(String(finalValue))
  }, [borrowValueInUSD, coreStakeInfo.discount, coreStakeInfo.usd, coreStakeInfo.userValue])

  const coreStake = Number(coreValue) * coreStakeInfo.discount
  const extraStake = Number(extraValue) * extraStakeInfo.discount

  const stake = coreStake * coreStakeInfo.usd + extraStake * extraStakeInfo.usd

  const health = Math.max(Math.round(stake && (1 - borrowValueInUSD / stake) * 100), 0)
  const borrowCapacity = Math.max(stake - borrowValueInUSD, 0)

  const firstInputError = Number(coreValue) > coreStakeInfo.userValue
  const secondInputError = Number(extraValue) > extraStakeInfo.userValue
  const borrowCapacityError = borrowCapacity <= 0

  const error = borrowCapacityError || firstInputError || secondInputError

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>{health}%</div>
      <div>Debt {formatUsd(borrowValueInUSD)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>Collateral {formatUsd(stake)}</div>
      <div>Borrow capacity {formatUsd(borrowCapacity)}</div>
    </div>
  )
  return (
    <ModalLayout onClose={onClose} onPrev={onPrev} infoSlot={infoSlot}>
      <h3>Add collateral</h3>
      <div>
        <input
          style={{ border: firstInputError ? '1px solid red' : '' }}
          type="number"
          value={coreValue}
          onChange={(e) => {
            setCoreValue(e.target.value)
          }}
        />
        {coreStakeType}
        {!showExtraInput && (
          <button onClick={() => setIsStakeListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
      </div>
      {isStakeListOpen && !showExtraInput && (
        <div>
          {stakeTypes.map((type) => (
            <button key={type} type="button" onClick={() => setCoreStakeType(type)}>
              {mockTokenInfoByType[type].userValue} {type} {type === coreStakeType && '✓'}
            </button>
          ))}
        </div>
      )}
      {!showExtraInput && (
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
          {extraStakeType}
        </div>
      )}
      <button
        type="button"
        disabled={error}
        onClick={() =>
          onSend({
            debts: [{ type: borrowType, value: Number(borrowValue) }],
            stakes: [
              { type: coreStakeType, value: Number(coreValue) },
              ...(showExtraInput ? [{ type: extraStakeType, value: Number(extraValue) }] : []),
            ],
          })
        }
      >
        borrow {borrowValue} {borrowType}
      </button>
      <div>with apr {APR}</div>
    </ModalLayout>
  )
}
