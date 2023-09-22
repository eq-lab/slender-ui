import React from 'react'
import Typography from '@marginly/ui/components/typography'
import { ReactComponent as InfoIcon } from './info-small.svg'
import * as S from './styled'

const DASHES_AMOUNT = 45

const getDashesCount = (percent: number) => (DASHES_AMOUNT * percent) / 100

interface Props {
  healthPercent?: number
}

export function HealthMeter({ healthPercent = 0 }: Props) {
  const dashesCount = getDashesCount(healthPercent)
  return (
    <S.HealthMeterContainer>
      <S.HealthMeterWrapper>
        {Array.from(Array(DASHES_AMOUNT).keys()).map((number) => (
          <S.MeterDash key={number} index={number} shaded={number < dashesCount} />
        ))}
      </S.HealthMeterWrapper>
      <S.HealthPercentCountContainer>
        <Typography headerS>{healthPercent}%</Typography>
      </S.HealthPercentCountContainer>
      <S.HealthTooltipContainer>
        <Typography caption className="health-text">
          Health
        </Typography>
        <InfoIcon />
      </S.HealthTooltipContainer>
    </S.HealthMeterContainer>
  )
}
