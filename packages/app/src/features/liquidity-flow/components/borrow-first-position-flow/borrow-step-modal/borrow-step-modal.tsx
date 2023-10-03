import React from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { formatCompactCryptoCurrency } from '@/shared/formatters'
import { TokenSuperField } from '@/shared/components/token-super-field'
import { getMaxDebt } from '../../../utils/get-max-debt'
import { getRequiredError } from '../../../utils/get-required-error'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { ModalLayout } from '../../modal-layout'
import { FormLayout } from '../../form-layout'
import { TokenThumbnail } from '../../token-thumbnail'

interface Props {
  onClose: () => void
  onContinue: () => void
  value: string
  onBorrowValueChange: (value: string) => void
  maxDepositUsd: number
  debtTokenName: SupportedTokenName
}

export function BorrowStepModal({
  onClose,
  onContinue,
  value,
  onBorrowValueChange,
  debtTokenName,
  maxDepositUsd,
}: Props) {
  const borrowCoinInfo = useTokenInfo(debtTokenName)

  const { borrowInterestRate, availableToBorrow } = useMarketDataForDisplay(
    tokenContracts[debtTokenName],
  )

  const getTokenByTokenName = useGetTokenByTokenName()
  const debtToken = getTokenByTokenName(debtTokenName)
  const debtTokenSymbol = debtToken?.symbol

  const infoSlot = (
    <InfoLayout
      title={debtToken?.title}
      mediaSection={<TokenThumbnail tokenName={debtTokenName} />}
    >
      <InfoRow label="Borrow APR" value={borrowInterestRate} />
      <InfoRow
        label="Available"
        value={`${formatCompactCryptoCurrency(availableToBorrow)} ${debtTokenSymbol}`}
      />
    </InfoLayout>
  )

  const maxDebt = getMaxDebt(availableToBorrow, maxDepositUsd, borrowCoinInfo.priceInUsd)
  const formError =
    getRequiredError({ value, valueDecimals: borrowCoinInfo.decimals }) || Number(value) > maxDebt

  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <FormLayout
        title="How much to borrow"
        description={formError ? 'Add borrow amount first' : 'Add collateral on the next step'}
        buttonProps={{
          label: `Continue`,
          onClick: onContinue,
          disabled: formError,
        }}
      >
        <TokenSuperField
          onChange={onBorrowValueChange}
          initFocus
          value={value}
          title="To borrow"
          badgeValue={String(maxDebt)}
          tokenSymbol={debtTokenSymbol}
        />
      </FormLayout>
    </ModalLayout>
  )
}
