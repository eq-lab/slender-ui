import styled from 'styled-components';
import TypographyUi from '@marginly/ui/components/typography';

export const Wrapper = styled.div`
  width: 352px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Typography = styled(TypographyUi)`
  &&& {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0em;
    margin-bottom: 24px;
  }
`;

export const Inner = styled.div`
  display: grid;
  grid-template-columns: 100%;
  gap: 32px;
  margin-bottom: 64px;
`;

export const Button = styled.button`
  display: flex;
  height: 64px;
  padding: 0 48px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  color: white;
  width: 100%;
  background: var(--fill-primary);
  cursor: pointer;
  &:disabled {
    opacity: 0.24;
    cursor: auto;
  }
`;

export const BottomSection = styled.div`
  grid-template-columns: 100%;
  margin-top: auto;
  display: grid;
  gap: 16px;
  justify-items: center;
`;
