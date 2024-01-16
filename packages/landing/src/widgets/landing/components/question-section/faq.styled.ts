import { styled } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  padding: 0 var(--spacing-space-24, 24px);
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;

  border-radius: var(--rounding-radius-xl, 24px);
  background: var(--fill-secondary, rgba(204, 187, 184, 0.16));
  backdrop-filter: blur(12px);

  margin-bottom: 8px;
`;

export const FaqHeader = styled.header`
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  align-self: stretch;
  font-size: 20px;

  svg {
    transform: rotate(180deg);
  }

  &.expanded {
    svg {
      transform: rotate(0deg);
    }
  }
`;

export const Section = styled.section`
  padding: 0 48px 32px 0;
  color: var(--text-secondary, #f2edeb7a);

  a {
    color: inherit;
    text-decoration: underline;
  }
`;
