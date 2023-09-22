import React, { useEffect, useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
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
import { AssetSelect } from '../asset-select'
import { InputLayout } from '../../styled'
import { getDepositUsd } from '../../utils/get-deposit-usd'
import { getRequiredError } from '../../utils/get-required-error'
import { excludeSupportedTokens } from '../../utils/exclude-supported-tokens'
import { AddAsset } from '../add-asset/add-asset'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedTokenName
  onSend: (value: PositionUpdate) => void
  depositTokenNames: SupportedTokenName[]
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

  const [coreDepositTokenName, setCoreDepositTokenName] = useState<SupportedTokenName>(tokenName)
  const [extraDepositTokenName, setExtraDepositTokenName] = useState<SupportedTokenName>()

  useEffect(() => {
    setCoreDepositTokenName(tokenName)
  }, [tokenName])

  const coreDepositInfo = useTokenInfo(coreDepositTokenName)
  const extraDepositInfo = useTokenInfo(extraDepositTokenName)

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

  const excludedTokens = excludeSupportedTokens([coreDepositTokenName], depositTokenNames)
  const hasExtraDepositToken = Boolean(excludedTokens.length)

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

    if (extraDepositTokenName && extraDepositTokenName) {
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
    getRequiredError(value, extraValue, Boolean(extraDepositTokenName))

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
        title="Add collateral"
        description={renderDescription()}
        buttonProps={{
          label: `Lend`,
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
          {!extraDepositTokenName && hasExtraDepositToken && (
            <AssetSelect
              onChange={setCoreDepositTokenName}
              tokenNames={depositTokenNames}
              value={coreDepositTokenName}
            />
          )}
        </InputLayout>

        {!extraDepositTokenName && (
          <AddAsset excludedTokens={excludedTokens} onChange={setExtraDepositTokenName} />
        )}
        {extraDepositTokenName && (
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
