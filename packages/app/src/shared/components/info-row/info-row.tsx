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
      <div>
        <S.ValueSection>
          <div>{value}</div>
          {subValue && <S.SubValue>{subValue}</S.SubValue>}
        </S.ValueSection>
      </div>
    </S.Wrapper>
  )
}
