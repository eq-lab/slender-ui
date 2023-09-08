import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { PositionSummary } from '../position-summary'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  token: SupportedToken
  onSend: (value: Partial<Record<SupportedToken, number>>) => void
  depositTokens: SupportedToken[]
}

export function LendIncreaseModal({
  depositSumUsd,
  onClose,
  token,
  onSend,
  depositTokens,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositToken, setCoreDepositToken] = useState<SupportedToken>(token)
  const [isDepositListOpen, setIsDepositListOpen] = useState(false)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDepositToken(token)
  }, [token])

  const extraDebtToken = depositTokens[0] === coreDepositToken ? depositTokens[1] : depositTokens[0]

  const coreDepositInfo = mockTokenInfoByType[coreDepositToken]
  const extraDepositInfo = extraDebtToken && mockTokenInfoByType[extraDebtToken]

  const actualDepositUsd =
    depositSumUsd +
    Number(value) * coreDepositInfo.usd * coreDepositInfo.discount +
    Number(extraValue) * (extraDepositInfo?.usd || 0) * (extraDepositInfo?.discount || 0)

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDebtUsd: debtSumUsd,
      debtUsd: debtSumUsd,
      actualDepositUsd,
    })

  const hasExtraDepositToken = Boolean(depositTokens[1])

  const coreInputMax = coreDepositInfo.userValue
  const extraInputMax = extraDepositInfo?.userValue || 0

  const coreInputError = Number(value) > coreDepositInfo.userValue
  const extraInputError = Number(extraValue) > (extraDepositInfo?.userValue || 0)

  const getSaveData = (): Partial<Record<SupportedToken, number>> => {
    const core = { [coreDepositToken]: Number(value) }

    if (showExtraInput && extraDebtToken) {
      return {
        ...core,
        [extraDebtToken]: Number(extraValue),
      }
    }

    return core
  }

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={actualDepositUsd}
          health={health}
          healthDelta={healthDelta}
          borrowCapacityError={borrowCapacityError}
          depositSumUsdDelta={actualDepositUsd - depositSumUsd}
        />
      }
      onClose={onClose}
    >
      <h3>Add collateral</h3>
      <input
        onChange={(e) => setValue(e.target.value)}
        type="number"
        value={value}
        style={{ border: coreInputError ? '1px solid red' : '' }}
      />
      {coreDepositToken}

      <button type="button" onClick={() => setValue(String(coreInputMax))}>
        max {coreInputMax}
      </button>

      {!showExtraInput && hasExtraDepositToken && (
        <button onClick={() => setIsDepositListOpen((state) => !state)} type="button">
          change collateral
        </button>
      )}
      {isDepositListOpen && !showExtraInput && (
        <div>
          {depositTokens.map((depositToken) => {
            if (!depositToken) {
              return null
            }
            return (
              <button
                key={depositToken}
                type="button"
                onClick={() => setCoreDepositToken(depositToken)}
              >
                {mockTokenInfoByType[depositToken].userValue} {depositToken}{' '}
                {depositToken === coreDepositToken && '✓'}
              </button>
            )
          })}
        </div>
      )}
      {!showExtraInput && hasExtraDepositToken && (
        <div>
          <button onClick={() => setShowExtraInput(true)} type="button">
            add asset
          </button>
        </div>
      )}
      {showExtraInput && (
        <div>
          <input
            style={{ border: extraInputError ? '1px solid red' : '' }}
            type="number"
            value={extraValue}
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
          />
          {extraDebtToken}
          <button type="button" onClick={() => setExtraValue(String(extraInputMax))}>
            max {extraInputMax}
          </button>
        </div>
      )}
      <div>
        <button
          onClick={() => onSend(getSaveData())}
          type="button"
          disabled={borrowCapacityError || coreInputError || extraInputError}
        >
          Borrow
        </button>
      </div>
    </ModalLayout>
  )
}
