import React, { useEffect, useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useAvailableToBorrow } from '@/entities/token/hooks/use-available-to-borrow'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils/get-position-info'
import { FormLayout } from '../form-layout'
import { PositionUpdate } from '../../types'
import { AddAssetButton } from '../add-asset-button'
import { AssetSelect } from '../asset-select'
import { InputLayout } from '../../styled'
import { getMaxDebt } from '../../utils/get-max-debt'
import { getExtraTokenName } from '../../utils/get-extra-token-name'
import { getRequiredError } from '../../utils/get-required-error'
import { makePosition } from '../../utils/make-position'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedTokenName
  onSend: (value: PositionUpdate) => void
  debtTokenNames: SupportedTokenName[]
}

export function BorrowIncreaseModal({
  depositSumUsd,
  onClose,
  tokenName,
  onSend,
  debtTokenNames,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtTokenName, setCoreDebtTokenName] = useState<SupportedTokenName>(tokenName)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDebtTokenName(tokenName)
  }, [tokenName])

  const extraDebtTokenName = getExtraTokenName(debtTokenNames, coreDebtTokenName)

  const { availableToBorrow: coreAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[coreDebtTokenName],
  )
  const { availableToBorrow: extraAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[extraDebtTokenName ?? coreDebtTokenName],
  )

  const coreDebtInfo = useTokenInfo(coreDebtTokenName)
  const extraDebtInfo = useTokenInfo(extraDebtTokenName as SupportedTokenName)

  const { availableToBorrow } = useMarketDataForDisplay(tokenContracts[coreDebtTokenName])

  const inputDebtSumUsd =
    Number(value) / coreDebtInfo.priceInUsd + Number(extraValue) / extraDebtInfo.priceInUsd

  const actualDebtUsd = debtSumUsd + inputDebtSumUsd

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd: depositSumUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd,
  })

  const hasExtraDeptToken = Boolean(debtTokenNames[1])

  const coreMaxDebt = getMaxDebt(
    coreAvailableToBorrow,
    defaultBorrowCapacity,
    coreDebtInfo.priceInUsd,
  )

  const extraInputMax =
    extraDebtTokenName &&
    getMaxDebt(extraAvailableToBorrow, defaultBorrowCapacity, extraDebtInfo.priceInUsd)

  const coreInputError = Number(value) > coreMaxDebt
  const extraInputError = Number(extraValue) > (extraInputMax || 0)

  const formError =
    borrowCapacityError ||
    coreInputError ||
    extraInputError ||
    getRequiredError(value, extraValue, showExtraInput)

  const getTokenByTokenName = useGetTokenByTokenName()
  const coreToken = getTokenByTokenName(coreDebtTokenName)
  const coreTokenSymbol = coreToken?.symbol
  const extraToken = getTokenByTokenName(extraDebtTokenName)
  const extraTokenSymbol = extraToken?.symbol

  const getSaveData = (): PositionUpdate => {
    const core = {
      [coreDebtTokenName]: makePosition(coreDebtTokenName, value, coreToken?.decimals),
    }

    if (showExtraInput && extraDebtTokenName) {
      const extraDebt = makePosition(extraDebtTokenName, extraValue, extraToken?.decimals)
      return {
        ...core,
        [extraDebtTokenName]: extraDebt,
      }
    }

    return core
  }

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={inputDebtSumUsd}
          healthDelta={healthDelta}
          borrowCapacityError={borrowCapacityError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to borrow"
        description={hasExtraDeptToken ? undefined : `${availableToBorrow} available to borrow`}
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
            title="To borrow"
            placeholder={`Max ${coreMaxDebt} ${coreTokenSymbol}`}
            className={cn(coreInputError && Error)}
            postfix={coreTokenSymbol}
          />
          {!showExtraInput && hasExtraDeptToken && (
            <AssetSelect
              onChange={setCoreDebtTokenName}
              tokenNames={debtTokenNames}
              value={coreDebtTokenName}
            />
          )}
        </InputLayout>

        {!showExtraInput && hasExtraDeptToken && (
          <AddAssetButton onClick={() => setShowExtraInput(true)} />
        )}

        {showExtraInput && (
          <SuperField
            type="number"
            onChange={(e) => {
              setExtraValue(e.target.value)
            }}
            value={extraValue}
            title="To borrow"
            placeholder={`Max ${extraInputMax} ${extraTokenSymbol}`}
            className={cn(extraInputError && Error)}
            postfix={extraTokenSymbol}
          />
        )}
      </FormLayout>
    </ModalLayout>
  )
}
