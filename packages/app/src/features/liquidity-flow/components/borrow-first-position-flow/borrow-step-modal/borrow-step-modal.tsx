import React from 'react'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import { useTokenCache } from '@/entities/token/context/hooks'
import { InfoRow } from '@/shared/components/info-row'
import { InfoLayout } from '@/shared/components/info-layout'
import { SuperField } from '@marginly/ui/components/input/super-field'
import { useGetInfoByTokenName } from '@/entities/token/hooks/use-get-info-by-token-name'
import { getIconByToken } from '@/entities/token/utils/get-icon-by-token'
import { useTokenInfo } from '../../../hooks/use-token-info'
import { DEFAULT_HEALTH_VALUE } from '../../../constants'
import { ModalLayout } from '../../modal-layout'
import { FormLayout } from '../../form-layout'

interface Props {
  onClose: () => void
  onContinue: () => void
  value: string
  onBorrowValueChange: (value: string) => void
  debtToken: SupportedToken
  depositToken: SupportedToken
}

export function BorrowStepModal({
  onClose,
  onContinue,
  value,
  onBorrowValueChange,
  debtToken,
  depositToken,
}: Props) {
  const getInfoByTokenName = useGetInfoByTokenName()

  const borrowCoinInfo = useTokenInfo(debtToken)
  const { discount, priceInUsd, userBalance } = useTokenInfo(depositToken)

  const { borrowInterestRate, availableToBorrow } = useMarketDataForDisplay(
    tokenContracts[debtToken],
  )
  const tokenCache = useTokenCache()?.[tokenContracts[debtToken].address]

  const max = Math.min(
    Math.floor(
      (userBalance * discount * priceInUsd * DEFAULT_HEALTH_VALUE) / borrowCoinInfo.priceInUsd,
    ),
    availableToBorrow,
  )

  const debtTokenSymbol = getInfoByTokenName(debtToken)?.symbol
  const Icon = getIconByToken(debtToken)
  const infoSlot = (
    <InfoLayout title={`${debtToken} Coin`} mediaSection={<Icon width={48} />}>
      <InfoRow label="Borrow APR" value={borrowInterestRate} />
      <InfoRow label="Available" value={`${availableToBorrow} ${tokenCache?.symbol}`} />
    </InfoLayout>
  )

  return (
    <ModalLayout onClose={onClose} infoSlot={infoSlot}>
      <FormLayout
        title="How much to borrow"
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
