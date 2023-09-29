import styled from 'styled-components'
import ButtonUi from '@marginly/ui/components/button'

export const Wrapper = styled.div`
  display: inline-flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-variation-settings: 'wght' 700;
`

export const Button = styled(ButtonUi)`
  &&& {
    svg {
      fill: var(--icon-secondary);
    }
  }
`
