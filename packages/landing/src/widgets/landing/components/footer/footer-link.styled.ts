'use client'

import { styled } from 'styled-components'

export const FooterButton = styled.div`
  display: flex;
  width: 64px;
  height: 64px;
  padding: spacing/space-0 var(--spacing-space-20, 20px);
  justify-content: center;
  align-items: center;
  gap: var(--spacing-space-8, 8px);

  border-radius: var(--rounding-radius-m, 16px);
  background: var(--fill-primary, #faf8f7);
`
