import React, { useEffect, useState } from 'react'
import { SupportedToken, tokens } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { ModalLayout } from '../../modal-layout'
import { formatUsd } from '../../../formatters'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'

interface Props {
  onClose: () => void
  onPrev?: () => void
  debtValue: string
  debtToken: SupportedToken
  depositTokens: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function LendStepModal({
  onClose,
  onPrev,
  debtValue,
  debtToken,
  depositTokens,
  onSend,
}: Props) {
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

  const depositBalances = useGetBalance(depositTokens.map((tokenName) => tokens[tokenName].address))

  const debtValueInUSD = Number(debtValue) * debtCoinInfo.priceInUsd

  useEffect(() => {
    const inputValue = Math.floor(
      debtValueInUSD /
        (coreDepositInfo.discount * coreDepositInfo.priceInUsd * DEFAULT_HEALTH_VALUE),
    )

    const finalValue =
      inputValue > coreDepositInfo.userBalance ? coreDepositInfo.userBalance : inputValue
    setCoreValue(String(finalValue))
  }, [
    debtValueInUSD,
    coreDepositInfo.discount,
    coreDepositInfo.priceInUsd,
    coreDepositInfo.userBalance,
  ])

  const { borrowInterestRate } = useMarketDataForDisplay(tokens[debtToken])

  const coreDeposit = Number(coreValue) * coreDepositInfo.discount
  const extraDeposit = Number(extraValue) * extraDepositInfo.discount

  const deposit =
    coreDeposit * coreDepositInfo.priceInUsd + extraDeposit * extraDepositInfo.priceInUsd

  const health = Math.max(Math.round(deposit && (1 - debtValueInUSD / deposit) * 100), 0)
  const borrowCapacity = Math.max(deposit - debtValueInUSD, 0)

  const firstInputError = Number(coreValue) > coreDepositInfo.userBalance
  const secondInputError = Number(extraValue) > extraDepositInfo.userBalance
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
        {coreDepositToken}
        {!showExtraInput && (
          <button onClick={() => setIsDepositListOpen((state) => !state)} type="button">
            change collateral
          </button>
        )}
      </div>
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
        <div>
          <input
            style={{ border: secondInputError ? '1px solid red' : '' }}
            type="number"
            value={extraValue}
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
          />
          {extraDepositToken}
        </div>
      )}
      <button
        type="button"
        disabled={error}
        onClick={() =>
          onSend({
            debts: [{ token: debtToken, value: Number(debtValue) }],
            deposits: [
              { token: coreDepositToken, value: Number(coreValue) },
              ...(showExtraInput ? [{ token: extraDepositToken, value: Number(extraValue) }] : []),
            ],
          })
        }
      >
        borrow {debtValue} {debtToken}
      </button>
      <div>with apr {borrowInterestRate}</div>
    </ModalLayout>
  )
}
