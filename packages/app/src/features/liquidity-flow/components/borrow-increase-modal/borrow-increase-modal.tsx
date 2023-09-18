import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useAvailableToBorrow } from '@/entities/token/hooks/use-available-to-borrow'
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
import { getMaxDebt } from '../../utils/get-max-debt'
import { getExtraTokenName } from '../../utils/get-extra-token-name'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  tokenName: SupportedToken
  onSend: (value: PositionUpdate) => void
  debtTokenNames: SupportedToken[]
}

export function BorrowIncreaseModal({
  depositSumUsd,
  onClose,
  tokenName,
  onSend,
  debtTokenNames,
  debtSumUsd,
}: Props) {
  const getTokenByTokenName = useGetTokenByTokenName()

  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtTokenName, setCoreDebtTokenName] = useState<SupportedToken>(tokenName)
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
  const extraDebtInfo = useTokenInfo(extraDebtTokenName)

  const actualDebtUsd =
    debtSumUsd +
    Number(value) * coreDebtInfo.priceInUsd +
    Number(extraValue) * extraDebtInfo.priceInUsd

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDebtUsd,
    debtUsd: debtSumUsd,
    actualDepositUsd: depositSumUsd,
  })

  const debtUsdDelta = actualDebtUsd - debtSumUsd

  const hasExtraDeptToken = Boolean(debtTokenNames[1])

  const coreInputMax = getMaxDebt(
    coreAvailableToBorrow,
    defaultBorrowCapacity,
    coreDebtInfo.priceInUsd,
  )

  const extraInputMax =
    extraDebtTokenName &&
    getMaxDebt(extraAvailableToBorrow, defaultBorrowCapacity, extraDebtInfo.priceInUsd)

  const coreInputError = Number(value) > coreInputMax
  const extraInputError = Number(extraValue) > (extraInputMax || 0)

  const getSaveData = (): PositionUpdate => {
    const core = { [coreDebtTokenName]: BigInt(value) }

    if (showExtraInput && extraDebtTokenName) {
      return {
        ...core,
        [extraDebtTokenName]: BigInt(extraValue),
      }
    }

    return core
  }

  const sendButtonDisable = borrowCapacityError || coreInputError || extraInputError

  const extraTokenSymbol = getTokenByTokenName(extraDebtTokenName)?.symbol
  const coreTokenSymbol = getTokenByTokenName(coreDebtTokenName)?.symbol

  return (
    <ModalLayout
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={debtUsdDelta}
          healthDelta={healthDelta}
          borrowCapacityError={borrowCapacityError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to borrow"
        buttonProps={{
          label: `Borrow`,
          onClick: () => onSend(getSaveData()),
          disabled: sendButtonDisable,
        }}
      >
        <InputLayout>
          <SuperField
            onChange={(e) => setValue(e.target.value)}
            value={value}
            title="To borrow"
            placeholder={`Max ${coreInputMax} ${coreTokenSymbol}`}
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
