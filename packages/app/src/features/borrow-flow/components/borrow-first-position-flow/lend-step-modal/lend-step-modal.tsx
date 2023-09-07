import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import {
  APR,
  MINIMUM_HEALTH_VALUE,
  mockTokenInfoByType,
} from '@/shared/stellar/constants/mock-tokens-info'
import { Position } from '@/entities/position/types'
import { ModalLayout } from '../../modal-layout'
import { formatUsd } from '../../../formatters'

interface Props {
  onClose: () => void
  onPrev?: () => void
  debtValue: string
  debtType: SupportedToken
  depositTypes: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function LendStepModal({
  onClose,
  onPrev,
  debtValue,
  debtType,
  depositTypes,
  onSend,
}: Props) {
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositType, setCoreDepositType] = useState<SupportedToken>(depositTypes[0])
  const [isDepositListOpen, setIsDepositListOpen] = useState(false)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtCoinInfo = mockTokenInfoByType[debtType]
  const coreDepositInfo = mockTokenInfoByType[coreDepositType]
  const extraDepositType = depositTypes[0] === coreDepositType ? depositTypes[1] : depositTypes[0]
  const extraDepositInfo = mockTokenInfoByType[extraDepositType]

  const debtValueInUSD = Number(debtValue) * debtCoinInfo.usd

  useEffect(() => {
    const inputValue = Math.floor(
      debtValueInUSD / (coreDepositInfo.discount * coreDepositInfo.usd * MINIMUM_HEALTH_VALUE),
    )

    const finalValue =
      inputValue > coreDepositInfo.userValue ? coreDepositInfo.userValue : inputValue
    setCoreValue(String(finalValue))
  }, [debtValueInUSD, coreDepositInfo.discount, coreDepositInfo.usd, coreDepositInfo.userValue])

  const coreDeposit = Number(coreValue) * coreDepositInfo.discount
  const extraDeposit = Number(extraValue) * extraDepositInfo.discount

  const deposit = coreDeposit * coreDepositInfo.usd + extraDeposit * extraDepositInfo.usd

  const health = Math.max(Math.round(deposit && (1 - debtValueInUSD / deposit) * 100), 0)
  const borrowCapacity = Math.max(deposit - debtValueInUSD, 0)

  const firstInputError = Number(coreValue) > coreDepositInfo.userValue
  const secondInputError = Number(extraValue) > extraDepositInfo.userValue
  const borrowCapacityError = borrowCapacity <= 0

  const error = borrowCapacityError || firstInputError || secondInputError

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>{health}%</div>
      <div>Debt {formatUsd(debtValueInUSD)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>Collateral {formatUsd(deposit)}</div>
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
        {coreDepositType}
        {!showExtraInput && (
          <button onClick={() => setIsDepositListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
      </div>
      {isDepositListOpen && !showExtraInput && (
        <div>
          {depositTypes.map((type) => (
            <button key={type} type="button" onClick={() => setCoreDepositType(type)}>
              {mockTokenInfoByType[type].userValue} {type} {type === coreDepositType && '✓'}
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
          {extraDepositType}
        </div>
      )}
      <button
        type="button"
        disabled={error}
        onClick={() =>
          onSend({
            debts: [{ type: debtType, value: Number(debtValue) }],
            deposits: [
              { type: coreDepositType, value: Number(coreValue) },
              ...(showExtraInput ? [{ type: extraDepositType, value: Number(extraValue) }] : []),
            ],
          })
        }
      >
        borrow {debtValue} {debtType}
      </button>
      <div>with apr {APR}</div>
    </ModalLayout>
  )
}
