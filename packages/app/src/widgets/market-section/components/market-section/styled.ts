import styled from 'styled-components';
import TypographyUi from '@marginly/ui/components/typography';

export const MarketSectionWrapper = styled.section`
  margin-top: 64px;
`;

export const MarketSectionItemsWrapper = styled.div`
  display: flex;
  margin-top: 64px;
  gap: 32px;
`;

export const Typography = styled(TypographyUi)`
  &&& {
    font-size: 64px;
    line-height: 72px;
    font-weight: 500;
  }
`;
