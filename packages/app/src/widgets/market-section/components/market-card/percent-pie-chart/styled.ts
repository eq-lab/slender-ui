import styled from 'styled-components';

export const PieChartWrapper = styled.div<{ $percent: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;
  width: 48px;
  height: 48px;
  background-image: conic-gradient(
    var(--color-transparent-invert-gray6) ${({ $percent }) => $percent}%,
    var(--fill-secondary) 0%
  );
  border-radius: 50%;

  .percent {
    color: var(--text-primary-on-dark, #fff);
  }
`;
