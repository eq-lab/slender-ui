import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { Error } from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getExtraTokenName } from '@/features/liquidity-flow/utils/get-extra-token-name'
import { InputLayout } from '../../../styled'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { ModalLayout } from '../../modal-layout'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
import { FormLayout } from '../../form-layout'
import { AddAssetButton } from '../../add-asset-button'
import { AssetSelect } from '../../asset-select'

interface Props {
  onClose: () => void
  debtValue: string
  debtTokenName: SupportedToken
  depositTokenNames: [SupportedToken, SupportedToken]
  onSend: (value: Position) => void
}

export function LendStepModal({
  onClose,
  debtValue,
  debtTokenName,
  depositTokenNames,
  onSend,
}: Props) {
  const getTokenByTokenName = useGetTokenByTokenName()

  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositTokenName, setCoreDepositTokenName] = useState<SupportedToken>(
    depositTokenNames[0],
  )

  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtCoinInfo = useTokenInfo(debtTokenName)
  const coreDepositInfo = useTokenInfo(coreDepositTokenName)
  const extraDepositTokenName = getExtraTokenName(depositTokenNames, coreDepositTokenName)

  const extraDepositInfo = useTokenInfo(extraDepositTokenName)

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

  const { borrowInterestRate } = useMarketDataForDisplay(tokenContracts[debtTokenName])

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

  const extraTokenSymbol = getTokenByTokenName(extraDepositTokenName)?.symbol
  const coreTokenSymbol = getTokenByTokenName(coreDepositTokenName)?.symbol

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
        description={`With APR ${borrowInterestRate}`}
        buttonProps={{
          label: `Borrow ${debtValue} ${getTokenByTokenName(debtTokenName)?.symbol}`,
          onClick: () =>
            onSend({
              debts: [{ tokenName: debtTokenName, value: BigInt(debtValue) }],
              deposits: [
                { tokenName: coreDepositTokenName, value: BigInt(coreValue) },
                ...(showExtraInput
                  ? [{ tokenName: extraDepositTokenName, value: BigInt(extraValue) }]
                  : []),
              ],
            }),
          disabled: error,
        }}
      >
        <InputLayout>
          <SuperField
            onChange={(e) => {
              setCoreValue(e.target.value)
            }}
            value={coreValue}
            title="To deposit"
            placeholder={`${coreTokenSymbol} amount`}
            className={cn(firstInputError && Error)}
            postfix={coreTokenSymbol}
          />
          {!showExtraInput && (
            <AssetSelect
              onChange={setCoreDepositTokenName}
              tokenNames={depositTokenNames}
              value={coreDepositTokenName}
            />
          )}
        </InputLayout>

        {!showExtraInput && <AddAssetButton onClick={() => setShowExtraInput(true)} />}
        {showExtraInput && (
          <SuperField
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
            value={extraValue}
            title="To deposit"
            placeholder={`${extraTokenSymbol} amount`}
            className={cn(secondInputError && Error)}
            postfix={extraTokenSymbol}
          />
        )}
      </FormLayout>
    </ModalLayout>
  )
}
