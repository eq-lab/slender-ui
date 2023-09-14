import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
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
  const getSymbolByToken = useGetSymbolByToken()
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositToken, setCoreDepositToken] = useState<SupportedToken>(token)
  const [isDepositListOpen, setIsDepositListOpen] = useState(false)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDepositToken(token)
  }, [token])

  const extraDebtToken = depositTokens[0] === coreDepositToken ? depositTokens[1] : depositTokens[0]

  const coreDepositInfo = useTokenInfo(coreDepositToken)
  const possibleDepositInfo = useTokenInfo(extraDebtToken ?? coreDepositToken)
  const extraDepositInfo = extraDebtToken ? possibleDepositInfo : undefined

  const depositBalances = useGetBalance(
    depositTokens.map((tokenName) => tokenContracts[tokenName].address),
  )

  const actualDepositUsd =
    depositSumUsd +
    Number(value) * coreDepositInfo.userBalance * coreDepositInfo.discount +
    Number(extraValue) * (extraDepositInfo?.priceInUsd || 0) * (extraDepositInfo?.discount || 0)

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDebtUsd: debtSumUsd,
      debtUsd: debtSumUsd,
      actualDepositUsd,
    })

  const hasExtraDepositToken = Boolean(depositTokens[1])

  const coreInputMax = coreDepositInfo.userBalance
  const extraInputMax = extraDepositInfo?.userBalance || 0

  const coreInputError = Number(value) > coreDepositInfo.userBalance
  const extraInputError = Number(extraValue) > (extraDepositInfo?.userBalance || 0)

  const getSaveData = (): Partial<Record<SupportedToken, bigint>> => {
    const core = { [coreDepositToken]: BigInt(value) }

    if (showExtraInput && extraDebtToken) {
      return {
        ...core,
        [extraDebtToken]: BigInt(extraValue),
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
      <FormLayout
        title="How much to lend"
        buttonProps={{
          label: `Borrow`,
          onClick: () => onSend(getSaveData()),
          disabled: borrowCapacityError || coreInputError || extraInputError,
        }}
      >
        <SuperField
          onChange={(e) => setValue(e.target.value)}
          value={value}
          title="To deposit"
          placeholder={`${getSymbolByToken(coreDepositToken)} amount`}
          className={cn(coreInputError && Error)}
        />
        <button type="button" onClick={() => setValue(String(coreInputMax))}>
          Max {coreInputMax}
        </button>

        {!showExtraInput && hasExtraDepositToken && (
          <button onClick={() => setIsDepositListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
        {isDepositListOpen && !showExtraInput && (
          <div>
            {depositTokens.map((depositToken, index) => {
              if (!depositToken) {
                return null
              }
              return (
                <button
                  key={depositToken}
                  type="button"
                  onClick={() => setCoreDepositToken(depositToken)}
                >
                  {depositBalances[index]?.balance ?? 0} {depositToken}{' '}
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
            <SuperField
              onChange={(e) => setExtraValue(e.target.value)}
              value={extraValue}
              title="To deposit"
              placeholder={`${getSymbolByToken(extraDebtToken)} amount`}
              className={cn(extraInputError && Error)}
            />
            <button type="button" onClick={() => setExtraValue(String(extraInputMax))}>
              Max {extraInputMax}
            </button>
          </div>
        )}
      </FormLayout>
    </ModalLayout>
  )
}
