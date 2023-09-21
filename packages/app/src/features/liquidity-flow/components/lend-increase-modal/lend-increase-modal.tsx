import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { formatUsd } from '@/shared/formatters'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils/get-position-info'
import { FormLayout } from '../form-layout'
import { PositionUpdate } from '../../types'
import { AddAssetButton } from '../add-asset-button'
import { AssetSelect } from '../asset-select'
import { InputLayout } from '../../styled'
import { getExtraTokenName } from '../../utils/get-extra-token-name'
import { getDepositUsd } from '../../utils/get-deposit-usd'
import { getRequiredError } from '../../utils/get-required-error'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedToken
  onSend: (value: PositionUpdate) => void
  depositTokenNames: SupportedToken[]
}

export function LendIncreaseModal({
  depositSumUsd,
  onClose,
  tokenName,
  onSend,
  depositTokenNames,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositTokenName, setCoreDepositTokenName] = useState<SupportedToken>(tokenName)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDepositTokenName(tokenName)
  }, [tokenName])

  const extraDepositTokenName = getExtraTokenName(depositTokenNames, coreDepositTokenName)

  const coreDepositInfo = useTokenInfo(coreDepositTokenName)
  const extraDepositInfo = useTokenInfo(extraDepositTokenName as SupportedToken)

  const inputDepositSumUsd =
    getDepositUsd(value, coreDepositInfo.priceInUsd, coreDepositInfo.discount) +
    getDepositUsd(extraValue, extraDepositInfo.priceInUsd, extraDepositInfo.discount)

  const actualDepositUsd = depositSumUsd + inputDepositSumUsd

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDepositUsd,
      debtUsd: debtSumUsd,
      actualDebtUsd: debtSumUsd,
    })

  const hasExtraDepositToken = Boolean(depositTokenNames[1])

  const coreInputMax = coreDepositInfo.userBalance
  const extraInputMax = extraDepositInfo.userBalance

  const coreInputError = Number(value) > coreDepositInfo.userBalance
  const extraInputError = Number(extraValue) > extraDepositInfo.userBalance

  const getTokenByTokenName = useGetTokenByTokenName()
  const extraTokenSymbol = getTokenByTokenName(extraDepositTokenName)?.symbol
  const coreTokenSymbol = getTokenByTokenName(coreDepositTokenName)?.symbol
  const marketData = useMarketDataForDisplay(tokenContracts[coreDepositTokenName])

  const getSaveData = (): PositionUpdate => {
    const core = { [coreDepositTokenName]: BigInt(value) }

    if (showExtraInput && extraDepositTokenName) {
      return {
        ...core,
        [extraDepositTokenName]: BigInt(extraValue),
      }
    }

    return core
  }

  const formError =
    borrowCapacityError ||
    coreInputError ||
    extraInputError ||
    getRequiredError(value, extraValue, showExtraInput)

  const renderDescription = () => {
    if (!formError) return `${formatUsd(inputDepositSumUsd)} will be counted as collateral`
    if (hasExtraDepositToken) return 'Add deposit amount first'
    return `With ${marketData.discount}% discount`
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
          depositSumUsdDelta={inputDepositSumUsd}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to lend"
        description={renderDescription()}
        buttonProps={{
          label: `Borrow`,
          onClick: () => onSend(getSaveData()),
          disabled: formError,
        }}
      >
        <InputLayout>
          <SuperField
            type="number"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            title="To deposit"
            placeholder={`Max ${coreInputMax} ${coreTokenSymbol}`}
            className={cn(coreInputError && Error)}
            postfix={coreTokenSymbol}
          />
          {!showExtraInput && hasExtraDepositToken && (
            <AssetSelect
              onChange={setCoreDepositTokenName}
              tokenNames={depositTokenNames}
              value={coreDepositTokenName}
            />
          )}
        </InputLayout>

        {!showExtraInput && hasExtraDepositToken && (
          <AddAssetButton onClick={() => setShowExtraInput(true)} />
        )}
        {showExtraInput && (
          <SuperField
            type="number"
            onChange={(e) => setExtraValue(e.target.value)}
            value={extraValue}
            title="To deposit"
            placeholder={`Max ${extraInputMax} ${extraTokenSymbol}`}
            className={cn(extraInputError && Error)}
            postfix={extraTokenSymbol}
          />
        )}
      </FormLayout>
    </ModalLayout>
  )
}
