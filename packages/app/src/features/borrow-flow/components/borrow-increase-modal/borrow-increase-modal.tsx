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
  debtTokens: SupportedToken[]
}

export function BorrowIncreaseModal({
  depositSumUsd,
  onClose,
  token,
  onSend,
  debtTokens,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtToken, setCoreDebtToken] = useState<SupportedToken>(token)
  const [isDebtListOpen, setIsDebtListOpen] = useState(false)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDebtToken(token)
  }, [token])

  const extraDebtToken = debtTokens[0] === coreDebtToken ? debtTokens[1] : debtTokens[0]

  const actualDebtUsd =
    debtSumUsd +
    Number(value) * mockTokenInfoByType[coreDebtToken].usd +
    (extraDebtToken ? Number(extraValue) * mockTokenInfoByType[extraDebtToken].usd : 0)

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDebtUsd,
    debtUsd: debtSumUsd,
    actualDepositUsd: depositSumUsd,
  })

  const debtUsdDelta = actualDebtUsd - debtSumUsd

  const hasExtraDeptToken = Boolean(debtTokens[1])

  const coreInputMax = Math.floor(defaultBorrowCapacity / mockTokenInfoByType[coreDebtToken].usd)
  const extraInputMax =
    extraDebtToken && Math.floor(defaultBorrowCapacity / mockTokenInfoByType[extraDebtToken].usd)

  const secondInputError = false

  const getSaveData = (): Partial<Record<SupportedToken, number>> => {
    const core = { [coreDebtToken]: Number(value) }

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
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
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
      {coreDebtToken}

      <button type="button" onClick={() => setValue(String(coreInputMax))}>
        max {coreInputMax}
      </button>

      {!showExtraInput && hasExtraDeptToken && (
        <button onClick={() => setIsDebtListOpen((state) => !state)} type="button">
          change collateral
        </button>
      )}
      {isDebtListOpen && !showExtraInput && (
        <div>
          {debtTokens.map((debtToken) => {
            if (!debtToken) {
              return null
            }
            return (
              <button key={debtToken} type="button" onClick={() => setCoreDebtToken(debtToken)}>
                {mockTokenInfoByType[debtToken].userValue} {debtToken}{' '}
                {debtToken === coreDebtToken && '✓'}
              </button>
            )
          })}
        </div>
      )}
      {!showExtraInput && hasExtraDeptToken && (
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
          {extraDebtToken}
          <button type="button" onClick={() => setExtraValue(String(extraInputMax))}>
            max {extraInputMax}
          </button>
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
