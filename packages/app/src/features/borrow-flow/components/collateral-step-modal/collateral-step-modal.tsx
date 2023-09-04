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
  collateralTypes: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function CollateralStepModal({
  onClose,
  onPrev,
  borrowValue,
  borrowType,
  collateralTypes,
  onSend,
}: Props) {
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreCollateralType, setCoreCollateralType] = useState<SupportedToken>(collateralTypes[0])
  const [isCollateralListOpen, setIsCollateralListOpen] = useState(false)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const borrowCoinInfo = mockTokenInfoByType[borrowType]
  const coreCollateralInfo = mockTokenInfoByType[coreCollateralType]
  const extraCollateralType =
    collateralTypes[0] === coreCollateralType ? collateralTypes[1] : collateralTypes[0]
  const extraCollateralInfo = mockTokenInfoByType[extraCollateralType]

  const borrowValueInUSD = Number(borrowValue) * borrowCoinInfo.usd

  useEffect(() => {
    const inputValue = Math.floor(
      borrowValueInUSD /
        (coreCollateralInfo.discount * coreCollateralInfo.usd * MINIMUM_HEALTH_VALUE),
    )

    const finalValue =
      inputValue > coreCollateralInfo.userValue ? coreCollateralInfo.userValue : inputValue
    setCoreValue(String(finalValue))
  }, [
    borrowValueInUSD,
    coreCollateralInfo.discount,
    coreCollateralInfo.usd,
    coreCollateralInfo.userValue,
  ])

  const coreCollateral = Number(coreValue) * coreCollateralInfo.discount
  const extraCollateral = Number(extraValue) * extraCollateralInfo.discount

  const collateral =
    coreCollateral * coreCollateralInfo.usd + extraCollateral * extraCollateralInfo.usd

  const health = Math.max(Math.round(collateral && (1 - borrowValueInUSD / collateral) * 100), 0)
  const borrowCapacity = Math.max(collateral - borrowValueInUSD, 0)

  const firstInputError = Number(coreValue) > coreCollateralInfo.userValue
  const secondInputError = Number(extraValue) > extraCollateralInfo.userValue
  const borrowCapacityError = borrowCapacity <= 0

  const error = borrowCapacityError || firstInputError || secondInputError

  const infoSlot = (
    <div>
      <h4>Position summary</h4>
      <div>{health}%</div>
      <div>Debt {formatUsd(borrowValueInUSD)}</div>
      <div style={{ color: borrowCapacityError ? 'red' : '' }}>
        Collateral {formatUsd(collateral)}
      </div>
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
        {coreCollateralType}
        {!showExtraInput && (
          <button onClick={() => setIsCollateralListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
      </div>
      {isCollateralListOpen && !showExtraInput && (
        <div>
          {collateralTypes.map((type) => (
            <button key={type} type="button" onClick={() => setCoreCollateralType(type)}>
              {mockTokenInfoByType[type].userValue} {type} {type === coreCollateralType && '✓'}
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
          {extraCollateralType}
        </div>
      )}
      <button
        type="button"
        disabled={error}
        onClick={() =>
          onSend({
            debts: [{ type: borrowType, value: Number(borrowValue) }, null],
            collaterals: [
              { type: coreCollateralType, value: Number(coreValue) },
              showExtraInput ? { type: extraCollateralType, value: extraCollateral } : null,
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
