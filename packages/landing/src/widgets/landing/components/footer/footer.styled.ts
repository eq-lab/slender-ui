'use client'

import { styled } from 'styled-components'

export const Wrapper = styled.footer`
  position: relative;
  display: flex;
  padding: var(--spacing-space-96, 96px) 0 var(--spacing-space-128, 128px) 0;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-space-32, 32px);
  flex: 1 0 0;

  border-radius: var(--rounding-radius-xxxl, 48px);
  border: 1px dashed var(--border-primary, #faf8f7);

  margin: 0 24px;

  @media (min-width: 1024px) {
    margin: 0 88px;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-space-16, 16px);
`
