import styled from 'styled-components';
import TypographyUi from '@marginly/ui/components/typography';

export const PositionWrapper = styled.section`
  margin: 48px 0 128px;
`;

export const PositionHeaderWrapper = styled.section`
  display: flex;
  justify-content: space-between;
`;

export const PositionSumWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

export const PositionSumContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const PositionContainer = styled.div`
  margin-top: 48px;
  display: flex;
  gap: 32px;
`;

export const PositionSideContainer = styled.div`
  width: 100%;
  padding: 24px 32px 32px 32px;
  border-radius: 32px;
  background: rgba(204, 187, 184, 0.16);
`;

export const PositionCellContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const PositionHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const Typography = styled(TypographyUi)`
  &&& {
    font-size: 64px;
    line-height: 72px;
    font-weight: 500;
  }
`;

export const TitleHeader = styled(TypographyUi)`
  &&& {
    font-size: 32px;
    line-height: 40px;
  }
`;
