import React from 'react'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { supportedTokensIconStyles } from '@/shared/stellar/ui/supported-tokens-icon-styles'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import Thumbnail from '@marginly/ui/components/thumbnail'
import Typography from '@marginly/ui/components/typography'
import { formatUsd } from '@/shared/formatters'
import { useTokenCache } from '@/entities/token/context/hooks'

export function PositionCell({
  position,
  percentage,
  openDecreaseModal,
  openIncreaseModal,
  isLendPosition,
}: {
  position: PositionCellType
  percentage?: number
  openDecreaseModal: () => void
  openIncreaseModal: () => void
  isLendPosition?: boolean
}) {
  const { token, value, valueInUsd } = position
  const { color, Icon } = supportedTokensIconStyles[token]

  const { lendInterestRate, borrowInterestRate, discount } = useMarketDataForDisplay(
    tokenContracts[token],
  )
  const tokenCache = useTokenCache()?.[tokenContracts[token].address]

  return (
    <div>
      <Thumbnail md>
        <Icon />
      </Thumbnail>
      <em>
        {tokenCache?.name}
        {percentage && percentage !== 100 ? `: ${percentage}%` : null}
      </em>
      <br />
      {value.toString(10)} {token.toUpperCase()}{' '}
      {isLendPosition && (
        <Typography caption>
          <em>{discount} discount</em>
        </Typography>
      )}
      {borrowInterestRate && <div>{isLendPosition ? lendInterestRate : borrowInterestRate}</div>}
      {valueInUsd && Number(value) !== valueInUsd && <div>{formatUsd(valueInUsd)}</div>}
      <button type="button" onClick={openDecreaseModal}>
        &minus;
      </button>
      <button type="button" onClick={openIncreaseModal}>
        +
      </button>
    </div>
  )
}
