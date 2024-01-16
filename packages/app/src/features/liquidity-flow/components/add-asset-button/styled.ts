import styled from 'styled-components';
import ThumbnailUi from '@marginly/ui/components/thumbnail';

export const Wrapper = styled.div`
  display: inline-flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-variation-settings: 'wght' 700;
`;

export const Thumbnail = styled(ThumbnailUi)`
  fill: var(--icon-secondary);
`;
