import styled from 'styled-components';
import TypographyUi from '@marginly/ui/components/typography';

export const Wrapper = styled.div`
  display: flex;
  min-height: 48px;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
`;

export const Typography = styled(TypographyUi)<{ $error?: boolean }>`
  color: ${({ $error }) => $error && 'var(--text-negative)'};
`;

export const ValueSection = styled.div`
  display: grid;
  align-items: center;
  justify-items: end;
`;
export const SubValue = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;
