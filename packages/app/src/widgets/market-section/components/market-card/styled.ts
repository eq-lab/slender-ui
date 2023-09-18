import styled from 'styled-components'

export const MarketCardWrapper = styled.div`
  background-color: var(--fill-secondary);
  border-radius: var(--rounding-radius-xl);
  padding: 32px 24px 24px 24px;
`

export const MarketCardUpperContainer = styled.div`
  padding-bottom: 24px;
`

export const MarketCardHeadingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 48px;
  grid-template-rows: 1fr 1fr;
  grid-column-gap: 12px;
  padding-bottom: 24px;

  .token-name {
    grid-area: 1 / 1 / 2 / 2;
  }
  .token-symbol {
    grid-area: 2 / 1 / 3 / 2;
  }
  .token-icon {
    grid-area: 1 / 2 / 3 / 3;
  }
`

export const MarketCardPoolInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 16px;
  padding: 64px 0 24px;

  .piechart-container {
    grid-area: 1 / 1 / 3 / 2;
  }
  .total-available {
    grid-area: 1 / 2 / 2 / 3;
  }
  .total-supplied {
    grid-area: 2 / 2 / 3 / 3;
  }
`

export const MarketCardBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 24px;
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
    grid-area: 1 / 1 / 3 / 2;
  }
  .upper-text-container {
    grid-area: 1 / 2 / 2 / 3;
  }
  .bottom-text-container {
    grid-area: 2 / 2 / 3 / 3;
  }
`

export const MarketCardButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`
