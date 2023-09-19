import React from 'react'
import { tokenContracts } from '@/shared/stellar/constants/tokens'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useMarketDataForDisplay } from '@/entities/token/hooks/use-market-data-for-display'
import Thumbnail from '@marginly/ui/components/thumbnail'
import Typography from '@marginly/ui/components/typography'
import Label from '@marginly/ui/components/label'
import { formatUsd } from '@/shared/formatters'
import { useTokenCache } from '@/entities/token/context/hooks'
import * as S from './position-cell.styled'

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
  const { tokenName, value, valueInUsd } = position
  const Icon = getIconByTokenName(tokenName)

  const { lendInterestRate, borrowInterestRate, discount } = useMarketDataForDisplay(
    tokenContracts[tokenName],
  )
  const tokenCache = useTokenCache()?.[tokenContracts[tokenName].address]

  const interestRate = isLendPosition ? lendInterestRate : borrowInterestRate

  return (
    <S.PositionCellWrapper>
      <Thumbnail md>
        <Icon />
      </Thumbnail>
      <S.PositionCellInfo>
        <S.PositionCellInfoItem>
          <Typography caption>
            {tokenCache?.name} {percentage && percentage !== 100 ? `· ${percentage}%` : null}
          </Typography>
          <S.PositionCellTokenAmount>
            <Typography>
              {value.toString(10)} {tokenCache?.symbol}{' '}
            </Typography>
            {interestRate && (
              <Label positive={isLendPosition} negative={!isLendPosition} sm>
                {isLendPosition ? '+' : '-'}
                {interestRate}
              </Label>
            )}
          </S.PositionCellTokenAmount>
        </S.PositionCellInfoItem>
        <S.PositionCellInfoItem>
          {isLendPosition && (
            <Typography caption>
              <em>{discount} discount</em>
            </Typography>
          )}
          {valueInUsd && Number(value) !== valueInUsd && <div>{formatUsd(valueInUsd)}</div>}
        </S.PositionCellInfoItem>
      </S.PositionCellInfo>
      <S.PositionCellButtons>
        <button type="button" onClick={openDecreaseModal}>
          &minus;
        </button>
        <button type="button" onClick={openIncreaseModal}>
          +
        </button>
      </S.PositionCellButtons>
    </S.PositionCellWrapper>
  )
}
