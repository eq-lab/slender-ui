'use client'

import styled from 'styled-components'
import { ReactComponent as SlenderLogoUi } from './slender-logo.svg'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: var(--background-secondary);
  border-radius: var(--rounding-radius-s);
`

export const ConnectButtonWrapper = styled.div`
  padding: 4px;
`

export const SlenderLogo = styled(SlenderLogoUi)`
  margin: 16px 20px;
`
