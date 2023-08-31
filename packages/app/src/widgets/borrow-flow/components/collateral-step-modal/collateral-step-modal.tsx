import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar-constants/tokens'
import { ModalLayout } from '../modal-layout'
import { APR, MINIMUM_HEALTH_VALUE, coinInfoByType } from '../../constants'
import { formatUsd } from '../../formatters'

interface Props {
  onClose: () => void
  onPrev?: () => void
  borrowValue: string
  borrowType: SupportedToken
  collateralTypes: [SupportedToken, SupportedToken]
}

export function CollateralStepModal({
  onClose,
  onPrev,
  borrowValue,
  borrowType,
  collateralTypes,
}: Props) {
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreCollateral, setCoreCollateral] = useState<SupportedToken>(collateralTypes[0])
  const [isCollateralListOpen, setIsCollateralListOpen] = useState(false)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const borrowCoinInfo = coinInfoByType[borrowType]
  const coreCollateralInfo = coinInfoByType[coreCollateral]
  const extraCollateral =
    collateralTypes[0] === coreCollateral ? collateralTypes[1] : collateralTypes[0]
  const extraCollateralInfo = coinInfoByType[extraCollateral]

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

  const collateral =
    Number(coreValue) * coreCollateralInfo.discount * coreCollateralInfo.usd +
    Number(extraValue) * extraCollateralInfo.discount * extraCollateralInfo.usd

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
        {coreCollateral}
        {!showExtraInput && (
          <button onClick={() => setIsCollateralListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
      </div>
      {isCollateralListOpen && !showExtraInput && (
        <div>
          {collateralTypes.map((type) => (
            <button key={type} type="button" onClick={() => setCoreCollateral(type)}>
              {coinInfoByType[type].userValue} {type} {type === coreCollateral && '✓'}
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
          {extraCollateral}
        </div>
      )}
      <button type="button" disabled={error}>
        borrow {borrowValue} {borrowType}
      </button>
      <div>with apr {APR}</div>
    </ModalLayout>
  )
}
