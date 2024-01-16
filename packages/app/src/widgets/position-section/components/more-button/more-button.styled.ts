import styled from 'styled-components';

export const MoreButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 0;
  color: var(--text-secondary);
  cursor: pointer;

  .plus-button {
    grid-area: 1 / 1 / 3 / 2;
    fill: var(--icon-secondary);
  }
  .upper-text {
    font-weight: 700;
    grid-area: 1 / 2 / 2 / 3;
  }
  .bottom-text {
    grid-area: 2 / 2 / 3 / 3;
  }
`;
