import React from 'react'
import Typography from '@marginly/ui/components/typography'
import { Tooltip } from '@/shared/components/tooltip'
import { ReactComponent as InfoIcon } from './info-small.svg'
import * as S from './styled'

const DASHES_AMOUNT = 45

const getDashesCount = (percent: number) => (DASHES_AMOUNT * percent) / 100

interface Props {
  healthPercent?: number
  healthDelta?: number
}

export function HealthMeter({ healthPercent = 0, healthDelta }: Props) {
  const percent = healthPercent > 0 ? healthPercent : 0
  const isRed = percent < 25
  const dashesCount = getDashesCount(percent)
  const healthDeltaText = healthDelta && `${healthDelta > 0 ? '+' : ''}${healthDelta}%`

  return (
    <Tooltip
      content={
        <S.TooltipTypography caption>
          Relative Net Position Value.
          <br />
          At 0% You Get Liquidated.
        </S.TooltipTypography>
      }
    >
      <S.HealthMeterWrapper>
        <S.HealthMeterContainer>
          <S.MeterContainer>
            {Array.from(Array(DASHES_AMOUNT).keys()).map((number) => (
              <S.MeterDash
                key={number}
                index={number}
                $shaded={number < dashesCount}
                $isRed={isRed}
              />
            ))}
          </S.MeterContainer>
          <S.HealthPercentCountContainer $isRed={isRed}>
            <Typography headerS className="heath-count-text">
              {healthPercent}%
            </Typography>
          </S.HealthPercentCountContainer>
          <S.HealthTooltipContainer $isRed={isRed}>
            <Typography caption className="health-text">
              {healthDeltaText || 'Health'}
            </Typography>
            <InfoIcon />
          </S.HealthTooltipContainer>
        </S.HealthMeterContainer>
      </S.HealthMeterWrapper>
    </Tooltip>
  )
}
