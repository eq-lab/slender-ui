import styled from 'styled-components'
import Button from '@marginly/ui/components/button'

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
  flex-wrap: wrap;
  gap: 8px;
`

export const PositionCellInfoItem = styled.div<{ $isBorrowPosition?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: auto;
  white-space: nowrap;
  &:first-child {
    min-width: 50%;
    width: auto;
  }
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

export const CellButton = styled(Button)`
  &&& {
    width: 48px;
    padding: 0;

    svg {
      width: 24px;
      margin: 0;
    }
  }
`
