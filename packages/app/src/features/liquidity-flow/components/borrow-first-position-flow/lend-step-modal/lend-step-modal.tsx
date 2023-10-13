import React, { useEffect, useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { Position } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { Error } from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { TokenSuperField } from '@/shared/components/token-super-field'
import { formatCompactCryptoCurrency } from '@/shared/formatters'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { getRequiredError } from '../../../utils/get-required-error'
import { getPositionInfo } from '../../../utils/get-position-info'
import { getExtraTokenName } from '../../../utils/get-extra-token-name'
import { getDepositUsd } from '../../../utils/get-deposit-usd'
import { InputLayout } from '../../../styled'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
import { FormLayout } from '../../form-layout'
import { AddAssetButton } from '../../add-asset-button'
import { AssetSelect } from '../../asset-select'
import { makePosition } from '../../../utils/make-position'
import { useGetAssetsInfo } from '../../../hooks/use-get-assets-info'
import { LiquidityModalLayout } from '../../modal/liquidity-modal-layout'

interface Props {
  debtValue: string
  debtTokenName: SupportedTokenName
  depositTokenNames: [SupportedTokenName, SupportedTokenName]
  depositTokenName: SupportedTokenName
  onSend: (value: Position) => void
  className?: string
}

const MIN_HEALTH_VALUE = 25

export function LendStepModal({
  debtValue,
  debtTokenName,
  depositTokenNames,
  onSend,
  depositTokenName,
  className,
}: Props) {
  const [coreValue, setCoreValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositTokenName, setCoreDepositTokenName] =
    useState<SupportedTokenName>(depositTokenName)

  const [showExtraInput, setShowExtraInput] = useState(false)

  const debtCoinInfo = useTokenInfo(debtTokenName)
  const coreDepositInfo = useTokenInfo(coreDepositTokenName)

  const extraDepositTokenName = getExtraTokenName(
    depositTokenNames,
    coreDepositTokenName,
  ) as SupportedTokenName

  const assetsInfo = useGetAssetsInfo(depositTokenNames, true)

  const extraDepositInfo = useTokenInfo(extraDepositTokenName)

  const debtUsd = Number(debtValue) / debtCoinInfo.priceInUsd

  const coreInputMax = coreDepositInfo.userBalance
  const extraInputMax = extraDepositInfo.userBalance

  useEffect(() => {
    const inputValue =
      debtUsd / ((coreDepositInfo.discount / coreDepositInfo.priceInUsd) * DEFAULT_HEALTH_VALUE)

    const finalValue = coreInputMax.lt(inputValue) ? coreInputMax : inputValue
    setCoreValue(String(finalValue))

    // We don't have to update the input when coreDepositInfo.discount or coreDepositInfo.priceInUsd changes,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coreInputMax, debtUsd])

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

  const firstInputError = coreInputMax.lt(coreValue)
  const secondInputError = extraInputMax.lt(extraValue)
  const requiredError = getRequiredError({
    value: coreValue,
    valueDecimals: coreDepositInfo.decimals,
    showExtraInput,
    extraValue,
    extraValueDecimals: extraDepositInfo.decimals,
  })

  const lowHealthError = health < MIN_HEALTH_VALUE
  const formError =
    borrowCapacityError || firstInputError || secondInputError || requiredError || lowHealthError

  const getTokenByTokenName = useGetTokenByTokenName()

  const renderDescription = () => {
    if (requiredError) return 'Enter collateral amount first'
    if (lowHealthError) return 'Add more collateral to have 25% health'
    if (firstInputError || secondInputError) return 'You don’t have enough funds'
    return `With APR −${borrowInterestRate}`
  }

  const debt = makePosition(debtTokenName, debtValue)

  const coreToken = getTokenByTokenName(coreDepositTokenName)
  const coreTokenSymbol = coreToken?.symbol
  const coreDeposit = makePosition(coreDepositTokenName, coreValue)

  const extraToken = getTokenByTokenName(extraDepositTokenName)
  const extraTokenSymbol = extraToken?.symbol
  const extraDeposit = makePosition(extraDepositTokenName, extraValue)

  const infoSlot = (
    <PositionSummary
      health={health}
      borrowCapacity={borrowCapacityInterface}
      depositSumUsd={depositUsd}
      debtUsd={debtUsd}
      collateralError={borrowCapacityError}
    />
  )
  return (
    <LiquidityModalLayout infoSlot={infoSlot} className={className}>
      <FormLayout
        title="Add collateral"
        description={renderDescription()}
        buttonProps={{
          label: `Borrow ${formatCompactCryptoCurrency(debtValue)} ${getTokenByTokenName(
            debtTokenName,
          )?.symbol}`,
          onClick: () =>
            onSend({
              debts: [debt],
              deposits: [coreDeposit, extraDeposit],
            }),
          disabled: formError,
        }}
      >
        <InputLayout>
          <TokenSuperField
            onChange={setCoreValue}
            initFocus
            value={coreValue}
            title="To deposit"
            tokenSymbol={coreTokenSymbol}
            badgeValue={String(coreInputMax)}
            className={cn(firstInputError && Error)}
          >
            {!showExtraInput && assetsInfo.length > 1 && (
              <AssetSelect
                onChange={setCoreDepositTokenName}
                assetsInfo={assetsInfo}
                value={coreDepositTokenName}
                tooltipText="Collateral Asset"
              />
            )}
          </TokenSuperField>
        </InputLayout>

        {!showExtraInput && <AddAssetButton onClick={() => setShowExtraInput(true)} />}
        {showExtraInput && (
          <TokenSuperField
            onChange={(e) => {
              setExtraValue(e)
            }}
            value={extraValue}
            title="To deposit"
            tokenSymbol={extraTokenSymbol}
            badgeValue={extraInputMax.toString(10)}
            className={cn(secondInputError && Error)}
          />
        )}
      </FormLayout>
    </LiquidityModalLayout>
  )
}
