import React from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import { getMaxDebt } from '@/features/liquidity-flow/utils/get-max-debt'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
import { ModalLayout } from '../../modal-layout'
import { FormLayout } from '../../form-layout'

interface Props {
  onClose: () => void
  onContinue: () => void
  value: string
  onBorrowValueChange: (value: string) => void
  debtTokenName: SupportedToken
  depositTokenName: SupportedToken
}

export function BorrowStepModal({
  onClose,
  onContinue,
  value,
  onBorrowValueChange,
  debtTokenName,
  depositTokenName,
}: Props) {
  const getTokenByTokenName = useGetTokenByTokenName()

  const borrowCoinInfo = useTokenInfo(debtTokenName)
  const { discount, priceInUsd, userBalance } = useTokenInfo(depositTokenName)

  const { borrowInterestRate, availableToBorrow } = useMarketDataForDisplay(
    tokenContracts[debtTokenName],
  )

  const defaultBorrowCapacity = userBalance * discount * priceInUsd * DEFAULT_HEALTH_VALUE

  const max = getMaxDebt(availableToBorrow, defaultBorrowCapacity, borrowCoinInfo.priceInUsd)

  const debtToken = getTokenByTokenName(debtTokenName)
  const debtTokenSymbol = debtToken?.symbol

  const Icon = getIconByTokenName(debtTokenName)
  const infoSlot = (
    <InfoLayout title={debtToken?.name} mediaSection={<Icon width={48} />}>
      <InfoRow label="Borrow APR" value={borrowInterestRate} />
      <InfoRow label="Available" value={`${availableToBorrow} ${debtTokenSymbol}`} />
    </InfoLayout>
  )

  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <FormLayout
        title="How much to borrow"
        description="Add borrow amount first"
        buttonProps={{
          label: `Continue`,
          onClick: onContinue,
          disabled: !Number(value) || Number(value) > max,
        }}
      >
        <SuperField
          onChange={(e) => {
            onBorrowValueChange(e.target.value)
          }}
          value={value}
          title="To borrow"
          placeholder={`Max ${max} ${debtTokenSymbol}`}
          postfix={debtTokenSymbol}
        />
      </FormLayout>
    </ModalLayout>
  )
}
