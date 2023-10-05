import React, { useEffect, useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { PositionSummary } from '@/entities/position/components/position-summary'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { formatCompactUsd } from '@/shared/formatters'
import BigNumber from 'bignumber.js'
import { TokenSuperField } from '@/shared/components/token-super-field'
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
import { useGetAssetsInfo } from '../../hooks/use-get-assets-info'

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

  const assetsInfo = useGetAssetsInfo(depositTokenNames, true)

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

  const coreInputError = coreDepositInfo.userBalance.lt(value)
  const extraInputError = extraDepositInfo.userBalance.lt(extraValue)

  const getTokenByTokenName = useGetTokenByTokenName()
  const coreToken = getTokenByTokenName(coreDepositTokenName)
  const coreTokenSymbol = coreToken?.symbol

  const extraToken = getTokenByTokenName(extraDepositTokenName)
  const extraTokenSymbol = extraToken?.symbol

  const marketData = useMarketDataForDisplay(tokenContracts[coreDepositTokenName])

  const getSaveData = (): PositionUpdate => {
    const core = {
      [coreDepositTokenName]: BigNumber(value),
    }

    if (extraDepositTokenName && extraDepositTokenName) {
      return {
        ...core,
        [extraDepositTokenName]: BigNumber(value),
      }
    }

    return core
  }

  const formError =
    borrowCapacityError ||
    coreInputError ||
    extraInputError ||
    getRequiredError({
      value,
      valueDecimals: coreDepositInfo.decimals,
      extraValue,
      extraValueDecimals: extraDepositInfo.decimals,
      showExtraInput: Boolean(extraDepositTokenName),
    })

  const renderDescription = () => {
    if (!formError) return `${formatCompactUsd(inputDepositSumUsd)} will be counted as collateral`
    if (hasExtraDepositToken) return 'Add deposit amount first'
    return `With ${marketData.discount} discount`
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
          <TokenSuperField
            initFocus
            onChange={setValue}
            value={value}
            title="To deposit"
            badgeValue={String(coreInputMax)}
            tokenSymbol={coreTokenSymbol}
            className={cn(coreInputError && Error)}
          >
            {!extraDepositTokenName && hasExtraDepositToken && assetsInfo.length > 1 && (
              <AssetSelect
                onChange={setCoreDepositTokenName}
                assetsInfo={assetsInfo}
                value={coreDepositTokenName}
                tooltipText="Collateral Asset"
              />
            )}
          </TokenSuperField>
        </InputLayout>

        {extraDepositTokenName ? (
          <TokenSuperField
            onChange={setExtraValue}
            value={extraValue}
            title="To deposit"
            badgeValue={extraInputMax.toString(10)}
            tokenSymbol={extraTokenSymbol}
            className={cn(extraInputError && Error)}
          />
        ) : (
          <AddAsset excludedTokens={excludedTokens} onChange={setExtraDepositTokenName} isDeposit />
        )}
      </FormLayout>
    </ModalLayout>
  )
}
