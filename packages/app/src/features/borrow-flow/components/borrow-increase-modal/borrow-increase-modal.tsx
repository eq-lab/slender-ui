import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useAvailableToBorrow } from '@/entities/token/hooks/use-available-to-borrow'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetSymbolByToken } from '@/entities/token/hooks/use-get-symbol-by-token'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { FormLayout } from '../form-layout'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  token: SupportedToken
  onSend: (value: Partial<Record<SupportedToken, bigint>>) => void
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
  const getSymbolByToken = useGetSymbolByToken()

  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtToken, setCoreDebtToken] = useState<SupportedToken>(token)
  const [isDebtListOpen, setIsDebtListOpen] = useState(false)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDebtToken(token)
  }, [token])

  const extraDebtToken = debtTokens[0] === coreDebtToken ? debtTokens[1] : debtTokens[0]

  const { availableToBorrow } = useAvailableToBorrow(tokenContracts[coreDebtToken])

  const coreDebtInfo = useTokenInfo(coreDebtToken)
  const extraDebtInfo = useTokenInfo(extraDebtToken ?? coreDebtToken)

  const actualDebtUsd =
    debtSumUsd +
    Number(value) * coreDebtInfo.priceInUsd +
    (extraDebtToken ? Number(extraValue) * extraDebtInfo.priceInUsd : 0)

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

  const coreInputMax = Math.min(
    availableToBorrow,
    Math.floor(defaultBorrowCapacity / coreDebtInfo.priceInUsd),
  )

  const extraInputMax =
    extraDebtToken &&
    Math.min(availableToBorrow, Math.floor(defaultBorrowCapacity / extraDebtInfo.priceInUsd))

  const depositBalances = useGetBalance(
    debtTokens.map((tokenName) => tokenContracts[tokenName].address),
  )

  const coreInputError = Number(value) > coreInputMax
  const extraInputError = Number(extraValue) > (extraInputMax || 0)

  const getSaveData = (): Partial<Record<SupportedToken, bigint>> => {
    const core = { [coreDebtToken]: BigInt(value) }

    if (showExtraInput && extraDebtToken) {
      return {
        ...core,
        [extraDebtToken]: BigInt(extraValue),
      }
    }

    return core
  }

  const sendButtonDisable = borrowCapacityError || coreInputError || extraInputError

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
      <FormLayout
        title="How much to borrow"
        buttonProps={{
          label: `Borrow`,
          onClick: () => onSend(getSaveData()),
          disabled: sendButtonDisable,
        }}
      >
        <SuperField
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To borrow"
          placeholder={`${getSymbolByToken(coreDebtToken)} amount`}
          className={cn(coreInputError && Error)}
        />
        <button type="button" onClick={() => setValue(String(coreInputMax))}>
          Max {coreInputMax}
        </button>

        {!showExtraInput && hasExtraDeptToken && (
          <button onClick={() => setIsDebtListOpen((state) => !state)} type="button">
            Change debt asset
          </button>
        )}
        {isDebtListOpen && !showExtraInput && (
          <div>
            {debtTokens.map((debtToken, index) => {
              if (!debtToken) {
                return null
              }
              return (
                <button key={debtToken} type="button" onClick={() => setCoreDebtToken(debtToken)}>
                  {depositBalances[index]?.balance ?? 0} {debtToken}{' '}
                  {debtToken === coreDebtToken && '✓'}
                </button>
              )
            })}
          </div>
        )}
        {!showExtraInput && hasExtraDeptToken && (
          <div>
            <button onClick={() => setShowExtraInput(true)} type="button">
              Add asset
            </button>
          </div>
        )}
        {showExtraInput && (
          <>
            <SuperField
              onChange={(e) => {
                setExtraValue(e.target.value)
              }}
              value={extraValue}
              title="To borrow"
              placeholder={`${getSymbolByToken(extraDebtToken)} amount`}
              className={cn(extraInputError && Error)}
            />
            <button type="button" onClick={() => setExtraValue(String(extraInputMax))}>
              Max {extraInputMax}
            </button>
          </>
        )}
      </FormLayout>
    </ModalLayout>
  )
}
