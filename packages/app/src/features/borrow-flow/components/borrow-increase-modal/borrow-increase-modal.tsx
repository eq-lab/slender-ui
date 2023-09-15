import React, { useEffect, useState } from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useAvailableToBorrow } from '@/entities/token/hooks/use-available-to-borrow'
import { PositionSummary } from '@/entities/position/components/position-summary'
import { SuperField } from '@marginly/ui/components/input/super-field'
import cn from 'classnames'
import { Error } from '@marginly/ui/constants/classnames'
import { useGetInfoByTokenName } from '@/entities/token/hooks/use-get-info-by-token-name'
import { useTokenInfo } from '../../hooks/use-token-info'
import { ModalLayout } from '../modal-layout'
import { getPositionInfo } from '../../utils'
import { FormLayout } from '../form-layout'
import { PositionUpdate } from '../../types'
import { AddAssetButton } from '../add-asset-button'
import { AssetSelect } from '../asset-select'
import { InputLayout, MaxButton } from '../../styled'

interface Props {
  debtSumUsd: number
  depositSumUsd: number
  onClose: () => void
  token: SupportedToken
  onSend: (value: PositionUpdate) => void
  debtTokens: SupportedToken[]
}

export function BorrowIncreaseModal({
  depositSumUsd,
  onClose,
  token,
  onSend,
  debtTokens,
  debtSumUsd,
}: Props) {
  const getInfoByTokenName = useGetInfoByTokenName()

  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDebtToken, setCoreDebtToken] = useState<SupportedToken>(token)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDebtToken(token)
  }, [token])

  const extraDebtToken = debtTokens[0] === coreDebtToken ? debtTokens[1] : debtTokens[0]

  const { availableToBorrow: coreAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[coreDebtToken],
  )
  const { availableToBorrow: extraAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[extraDebtToken ?? coreDebtToken],
  )

  const coreDebtInfo = useTokenInfo(coreDebtToken)
  const extraDebtInfo = useTokenInfo(extraDebtToken ?? coreDebtToken)

  const actualDebtUsd =
    debtSumUsd +
    Number(value) * coreDebtInfo.priceInUsd +
    (extraDebtToken ? Number(extraValue) * extraDebtInfo.priceInUsd : 0)

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

  const hasExtraDeptToken = Boolean(debtTokens[1])

  const coreInputMax = Math.min(
    coreAvailableToBorrow,
    Math.floor(defaultBorrowCapacity / coreDebtInfo.priceInUsd),
  )

  const extraInputMax =
    extraDebtToken &&
    Math.min(extraAvailableToBorrow, Math.floor(defaultBorrowCapacity / extraDebtInfo.priceInUsd))

  const coreInputError = Number(value) > coreInputMax
  const extraInputError = Number(extraValue) > (extraInputMax || 0)

  const getSaveData = (): PositionUpdate => {
    const core = { [coreDebtToken]: BigInt(value) }

    if (showExtraInput && extraDebtToken) {
      return {
        ...core,
        [extraDebtToken]: BigInt(extraValue),
      }
    }

    return core
  }

  const sendButtonDisable = borrowCapacityError || coreInputError || extraInputError

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
            placeholder={`${getInfoByTokenName(coreDebtToken)?.symbol} amount`}
            className={cn(coreInputError && Error)}
          />
          {!showExtraInput && hasExtraDeptToken && (
            <AssetSelect onChange={setCoreDebtToken} tokens={debtTokens} value={coreDebtToken} />
          )}
        </InputLayout>
        <div>
          <MaxButton onClick={() => setValue(String(coreInputMax))}>Max {coreInputMax}</MaxButton>
        </div>

        {!showExtraInput && hasExtraDeptToken && (
          <AddAssetButton onClick={() => setShowExtraInput(true)} />
        )}

        {showExtraInput && (
          <>
            <SuperField
              onChange={(e) => {
                setExtraValue(e.target.value)
              }}
              value={extraValue}
              title="To borrow"
              placeholder={`${getInfoByTokenName(extraDebtToken)?.symbol} amount`}
              className={cn(extraInputError && Error)}
            />
            <MaxButton onClick={() => setExtraValue(String(extraInputMax))}>
              Max {extraInputMax}
            </MaxButton>
          </>
        )}
      </FormLayout>
    </ModalLayout>
  )
}
