import React, { useEffect, useState } from 'react'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
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
  depositTokens: SupportedToken[]
}

export function LendIncreaseModal({
  depositSumUsd,
  onClose,
  token,
  onSend,
  depositTokens,
  debtSumUsd,
}: Props) {
  const getInfoByTokenName = useGetInfoByTokenName()
  const [value, setValue] = useState('')
  const [extraValue, setExtraValue] = useState('')

  const [coreDepositToken, setCoreDepositToken] = useState<SupportedToken>(token)
  const [showExtraInput, setShowExtraInput] = useState(false)

  useEffect(() => {
    setCoreDepositToken(token)
  }, [token])

  const extraDebtToken = depositTokens[0] === coreDepositToken ? depositTokens[1] : depositTokens[0]

  const coreDepositInfo = useTokenInfo(coreDepositToken)
  const possibleDepositInfo = useTokenInfo(extraDebtToken ?? coreDepositToken)
  const extraDepositInfo = extraDebtToken ? possibleDepositInfo : undefined

  const actualDepositUsd =
    depositSumUsd +
    Number(value) * coreDepositInfo.userBalance * coreDepositInfo.discount +
    Number(extraValue) * (extraDepositInfo?.priceInUsd || 0) * (extraDepositInfo?.discount || 0)

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDebtUsd: debtSumUsd,
      debtUsd: debtSumUsd,
      actualDepositUsd,
    })

  const hasExtraDepositToken = Boolean(depositTokens[1])

  const coreInputMax = coreDepositInfo.userBalance
  const extraInputMax = extraDepositInfo?.userBalance || 0

  const coreInputError = Number(value) > coreDepositInfo.userBalance
  const extraInputError = Number(extraValue) > (extraDepositInfo?.userBalance || 0)

  const getSaveData = (): PositionUpdate => {
    const core = { [coreDepositToken]: BigInt(value) }

    if (showExtraInput && extraDebtToken) {
      return {
        ...core,
        [extraDebtToken]: BigInt(extraValue),
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
            placeholder={`${getInfoByTokenName(coreDepositToken)?.symbol} amount`}
            className={cn(coreInputError && Error)}
          />
          {!showExtraInput && hasExtraDepositToken && (
            <AssetSelect
              onChange={setCoreDepositToken}
              tokens={depositTokens}
              value={coreDepositToken}
            />
          )}
        </InputLayout>
        <div>
          <MaxButton onClick={() => setValue(String(coreInputMax))}>Max {coreInputMax}</MaxButton>
        </div>

        {!showExtraInput && hasExtraDepositToken && (
          <AddAssetButton onClick={() => setShowExtraInput(true)} />
        )}
        {showExtraInput && (
          <div>
            <SuperField
              onChange={(e) => setExtraValue(e.target.value)}
              value={extraValue}
              title="To deposit"
              placeholder={`${getInfoByTokenName(extraDebtToken)?.symbol} amount`}
              className={cn(extraInputError && Error)}
            />
            <MaxButton onClick={() => setExtraValue(String(extraInputMax))}>
              Max {extraInputMax}
            </MaxButton>
          </div>
        )}
      </FormLayout>
    </ModalLayout>
  )
}
