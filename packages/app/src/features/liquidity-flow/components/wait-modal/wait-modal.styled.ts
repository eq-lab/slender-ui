import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 520px;
  min-height: 476px;
  padding: 32px 48px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon-wrapper {
    margin-top: 24px;
  }
  .header {
    margin-top: 32px;
  }
  .text {
    margin-top: 20px;
    color: var(--text-secondary, rgba(66, 61, 60, 0.64));
  }
`;
