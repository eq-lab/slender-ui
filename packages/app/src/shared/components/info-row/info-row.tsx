import React from 'react'
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
      {label}
      <S.ValueSection>
        <div>{value}</div>
        {subValue && <div>{subValue}</div>}
      </S.ValueSection>
    </S.Wrapper>
  )
}
