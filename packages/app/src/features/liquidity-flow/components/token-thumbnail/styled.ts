import styled from 'styled-components';
import ThumbnailUi from '@marginly/ui/components/thumbnail';

export const Thumbnail = styled(ThumbnailUi)<{ $backgroundColor: string }>`
  &&& {
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    svg {
      fill: var(--icon-on-dark);
    }
  }
`;
