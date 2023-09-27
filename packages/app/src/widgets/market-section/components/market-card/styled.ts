import styled from 'styled-components'
import Button from '@marginly/ui/components/button'

export const MarketCardWrapper = styled.div`
  width: 100%;
  background-color: var(--fill-secondary);
  border-radius: var(--rounding-radius-xl);
  overflow: hidden;
`

export const MarketCardUpperContainer = styled.div<{ $backgroundColor: string }>`
  color: var(--text-on-dark);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 32px 24px 24px 24px;
`

export const MarketCardHeadingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 48px;
  grid-template-rows: 1fr 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 12px;
  padding-bottom: 24px;

  .token-name {
    color: var(--text-on-dark);
    grid-area: 1 / 1 / 2 / 2;
  }
  .token-symbol {
    color: var(--text-on-dark);
    grid-area: 2 / 1 / 3 / 2;
  }
  .token-icon {
    width: 40px;
    fill: var(--icon-on-dark);
    grid-area: 1 / 2 / 3 / 3;
  }
`

export const MarketCardPoolInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 16px;
  padding-top: 64px;

  .piechart-with-tooltip-wrapper {
    position: relative;
    overflow: hidden;
    width: 48px;
    height: 48px;
    grid-area: 1 / 1 / 3 / 2;
    .piechart-with-tooltip-container {
      position: absolute;
      display: flex;
      &:hover {
        right: 0px;
      }
    }
  }
  .total-available {
    color: var(--text-on-dark);
    grid-area: 1 / 2 / 2 / 3;
  }
  .total-supplied {
    color: var(--text-on-dark);
    grid-area: 2 / 2 / 3 / 3;
  }
`

export const MarketCardBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`

export const MarketCardBottomInfo = styled.div`
  display: flex;
  gap: 32px;
`

export const MarketCardTextCell = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 12px;

  .tooltip-container {
    display: none;
    fill: rgba(217, 217, 217, 1);
    margin: auto;
    grid-area: 1 / 1 / 3 / 2;
  }
  .upper-text-container {
    grid-area: 1 / 1 / 2 / 3;
  }
  .bottom-text-container {
    grid-area: 2 / 1 / 3 / 3;
  }
`

export const MarketCardButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`

export const MarketCardButton = styled(Button)<{ $isLend?: boolean }>`
  &&& {
    color: var(${({ $isLend }) => ($isLend ? '--text-positive' : '--text-primary')});
    font-weight: 700;
  }
`
