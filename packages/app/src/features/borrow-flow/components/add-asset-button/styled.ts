import styled from 'styled-components'

export const Wrapper = styled.div`
  display: inline-flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-variation-settings: 'wght' 700;
`

export const Button = styled.div`
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--fill-secondary);
  svg {
    width: 24px;
    path {
      fill: var(--icon-secondary, #423d3c);
    }
  }
`
