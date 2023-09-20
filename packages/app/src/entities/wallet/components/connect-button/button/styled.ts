import styled from 'styled-components'

export const Wrapper = styled.button`
  height: 48px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 24px;
  gap: 8px;
  background: var(--fill-elevated);
  cursor: pointer;
  box-shadow:
    0px 4px 8px 0px rgba(51, 20, 0, 0.08),
    0px 2px 1px 0px rgba(51, 20, 0, 0.04);
  border: none;
  &:disabled {
    box-shadow: none;
    background: transparent;
    opacity: 0.24;
    cursor: auto;
  }
`
