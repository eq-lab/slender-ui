import styled from 'styled-components'

export const IconWrapper = styled.div`
  border-radius: 8px;
  height: 48px;
  width: 48px;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0px 4px 8px 0px rgba(51, 20, 0, 0.08),
    0px 2px 1px 0px rgba(51, 20, 0, 0.04);
  cursor: pointer;
  svg {
    width: 24px;
  }
`

export const MenuItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
