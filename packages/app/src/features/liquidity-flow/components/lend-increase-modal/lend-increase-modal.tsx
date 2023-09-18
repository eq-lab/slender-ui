import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
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
  const getTokenByTokenName = useGetTokenByTokenName()
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

  const actualDepositUsd =
    depositSumUsd +
    getDepositUsd(value, coreDepositInfo.priceInUsd, coreDepositInfo.discount) +
    getDepositUsd(extraValue, extraDepositInfo.priceInUsd, extraDepositInfo.discount)

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDebtUsd: debtSumUsd,
      debtUsd: debtSumUsd,
      actualDepositUsd,
    })

  const hasExtraDepositToken = Boolean(depositTokenNames[1])

  const coreInputMax = coreDepositInfo.userBalance
  const extraInputMax = extraDepositInfo.userBalance

  const coreInputError = Number(value) > coreDepositInfo.userBalance
  const extraInputError = Number(extraValue) > extraDepositInfo.userBalance

  const extraTokenSymbol = getTokenByTokenName(extraDepositTokenName)?.symbol
  const coreTokenSymbol = getTokenByTokenName(coreDepositTokenName)?.symbol

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
        <InputLayout>
          <SuperField
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
