import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { Error } from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getRequiredError } from '../../../utils/get-required-error'
import { getPositionInfo } from '../../../utils/get-position-info'
import { getExtraTokenName } from '../../../utils/get-extra-token-name'
import { getDepositUsd } from '../../../utils/get-deposit-usd'
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
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositTokenName, setCoreDepositTokenName] = useState<SupportedToken>(
    depositTokenNames[0],
  )

  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtCoinInfo = useTokenInfo(debtTokenName)
  const coreDepositInfo = useTokenInfo(coreDepositTokenName)

  const extraDepositTokenName = getExtraTokenName(
    depositTokenNames,
    coreDepositTokenName,
  ) as SupportedToken

  const extraDepositInfo = useTokenInfo(extraDepositTokenName)

  const debtUsd = Number(debtValue) * debtCoinInfo.priceInUsd

  useEffect(() => {
    const inputValue = Math.floor(
      debtUsd / (coreDepositInfo.discount * coreDepositInfo.priceInUsd * DEFAULT_HEALTH_VALUE),
    )

    const finalValue =
      inputValue > coreDepositInfo.userBalance ? coreDepositInfo.userBalance : inputValue
    setCoreValue(String(finalValue))
  }, [debtUsd, coreDepositInfo.discount, coreDepositInfo.priceInUsd, coreDepositInfo.userBalance])

  const { borrowInterestRate } = useMarketDataForDisplay(tokenContracts[debtTokenName])

  const depositUsd =
    getDepositUsd(coreValue, coreDepositInfo.priceInUsd, coreDepositInfo.discount) +
    getDepositUsd(extraValue, extraDepositInfo.priceInUsd, extraDepositInfo.discount)

  const { health, borrowCapacityError, borrowCapacityInterface } = getPositionInfo({
    depositUsd,
    actualDepositUsd: depositUsd,
    debtUsd,
    actualDebtUsd: debtUsd,
  })

  const firstInputError = Number(coreValue) > coreDepositInfo.userBalance
  const secondInputError = Number(extraValue) > extraDepositInfo.userBalance
  const requiredError = getRequiredError(coreValue, extraValue, showExtraInput)

  const formError = borrowCapacityError || firstInputError || secondInputError || requiredError

  const getTokenByTokenName = useGetTokenByTokenName()
  const extraTokenSymbol = getTokenByTokenName(extraDepositTokenName)?.symbol
  const coreTokenSymbol = getTokenByTokenName(coreDepositTokenName)?.symbol

  const renderDescription = () => {
    if (requiredError) return 'Enter collateral amount first'
    if (borrowCapacityError) return 'The amount of collateral is not enough to take the debt'
    if (firstInputError || secondInputError) return 'You don’t have enough funds'
    return `With APR ${borrowInterestRate}`
  }

  return (
    <ModalLayout
      onClose={onClose}
      infoSlot={
        <PositionSummary
          health={health}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositUsd}
          debtUsd={debtUsd}
          collateralError={borrowCapacityError}
        />
      }
    >
      <FormLayout
        title="Add collateral"
        description={renderDescription()}
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
          disabled: formError,
        }}
      >
        <InputLayout>
          <SuperField
            type="number"
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
            type="number"
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
