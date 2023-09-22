import styled from 'styled-components'

export const PositionCellWrapper = styled.div<{ $backgroundColor: string }>`
  display: flex;
  gap: 16px;

  .token-thumnail {
    background: ${({ $backgroundColor }) => $backgroundColor};
    fill: var(--icon-on-dark);
  }
`

export const PositionCellInfo = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`

export const PositionCellInfoItem = styled.div<{ $isBorrowPosition?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: ${({ $isBorrowPosition }) => ($isBorrowPosition ? '100%' : '50%')};
  white-space: nowrap;
`

export const PositionCellTokenAmount = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

export const PositionCellButtons = styled.div`
  display: flex;
  gap: 8px;
`
