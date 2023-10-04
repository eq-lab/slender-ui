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
    <S.Wrapper>
      <S.Typography $error={error}>{label}</S.Typography>
      <div>
        <S.ValueSection>
          <S.Typography $error={error}>{value}</S.Typography>
          {subValue && (
            <S.Typography secondary caption>
              {subValue}
            </S.Typography>
          )}
        </S.ValueSection>
      </div>
    </S.Wrapper>
  )
}
