import React from 'react'
import Typography from '@marginly/ui/components/typography'
import * as S from './styled'

interface Props {
  label: string
  value: string
  subValue?: string
  error?: boolean
}

export function InfoRow({ label, subValue, value, error }: Props) {
  return (
    <S.Wrapper $error={error}>
      <Typography>{label}</Typography>
      <div>
        <S.ValueSection>
          <Typography>{value}</Typography>
          {subValue && <Typography secondary>{subValue}</Typography>}
        </S.ValueSection>
      </div>
    </S.Wrapper>
  )
}
