import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { Error } from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import { useGetSymbolByToken } from '@/entities/token/hooks/use-get-symbol-by-token'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { ModalLayout } from '../../modal-layout'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
import { FormLayout } from '../../form-layout'

interface Props {
  onClose: () => void
  debtValue: string
  debtToken: SupportedToken
  depositTokens: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function LendStepModal({ onClose, debtValue, debtToken, depositTokens, onSend }: Props) {
  const getSymbolByToken = useGetSymbolByToken()

  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositToken, setCoreDepositToken] = useState<SupportedToken>(depositTokens[0])
  const [isDepositListOpen, setIsDepositListOpen] = useState(false)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtCoinInfo = useTokenInfo(debtToken)
  const coreDepositInfo = useTokenInfo(coreDepositToken)
  const extraDepositToken =
    depositTokens[0] === coreDepositToken ? depositTokens[1] : depositTokens[0]
  const extraDepositInfo = useTokenInfo(extraDepositToken)

  const depositBalances = useGetBalance(
    depositTokens.map((tokenName) => tokenContracts[tokenName].address),
  )

  const debtValueInUsd = Number(debtValue) * debtCoinInfo.priceInUsd

  useEffect(() => {
    const inputValue = Math.floor(
      debtValueInUsd /
        (coreDepositInfo.discount * coreDepositInfo.priceInUsd * DEFAULT_HEALTH_VALUE),
    )

    const finalValue =
      inputValue > coreDepositInfo.userBalance ? coreDepositInfo.userBalance : inputValue
    setCoreValue(String(finalValue))
  }, [
    debtValueInUsd,
    coreDepositInfo.discount,
    coreDepositInfo.priceInUsd,
    coreDepositInfo.userBalance,
  ])

  const { borrowInterestRate } = useMarketDataForDisplay(tokenContracts[debtToken])

  const coreDeposit = Number(coreValue) * coreDepositInfo.discount
  const extraDeposit = Number(extraValue) * extraDepositInfo.discount

  const deposit =
    coreDeposit * coreDepositInfo.priceInUsd + extraDeposit * extraDepositInfo.priceInUsd

  const health = Math.max(Math.round(deposit && (1 - debtValueInUsd / deposit) * 100), 0)
  const borrowCapacity = Math.max(deposit - debtValueInUsd, 0)

  const firstInputError = Number(coreValue) > coreDepositInfo.userBalance
  const secondInputError = Number(extraValue) > extraDepositInfo.userBalance
  const borrowCapacityError = borrowCapacity <= 0

  const error = borrowCapacityError || firstInputError || secondInputError

  return (
    <ModalLayout
      onClose={onClose}
      infoSlot={
        <PositionSummary
          health={health}
          borrowCapacity={borrowCapacity}
          depositSumUsd={deposit}
          debtUsd={debtValueInUsd}
          collateralError={borrowCapacityError}
        />
      }
    >
      <FormLayout
        title="Add collateral"
        description={`with apr ${borrowInterestRate}`}
        buttonProps={{
          label: `Borrow ${debtValue} ${getSymbolByToken(debtToken)}`,
          onClick: () =>
            onSend({
              debts: [{ token: debtToken, value: BigInt(debtValue) }],
              deposits: [
                { token: coreDepositToken, value: BigInt(coreValue) },
                ...(showExtraInput
                  ? [{ token: extraDepositToken, value: BigInt(extraValue) }]
                  : []),
              ],
            }),
          disabled: error,
        }}
      >
        <SuperField
          onChange={(e) => {
            setCoreValue(e.target.value)
          }}
          value={coreValue}
          title="To deposit"
          placeholder={`${getSymbolByToken(coreDepositToken)} amount`}
          className={cn(firstInputError && Error)}
        />
        {!showExtraInput && (
          <button onClick={() => setIsDepositListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
        {isDepositListOpen && !showExtraInput && (
          <div>
            {depositTokens.map((depositToken, index) => (
              <button
                key={depositToken}
                type="button"
                onClick={() => setCoreDepositToken(depositToken)}
              >
                {depositBalances[index]?.balance ?? 0} {depositToken}{' '}
                {depositToken === coreDepositToken && '✓'}
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
          <SuperField
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
            value={extraValue}
            title="To deposit"
            placeholder={`${getSymbolByToken(extraDepositToken)} amount`}
            className={cn(secondInputError && Error)}
          />
        )}
      </FormLayout>
    </ModalLayout>
  )
}
