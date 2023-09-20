import styled from 'styled-components'
import ThumbnailUi from '@marginly/ui/components/thumbnail'

export const Thumbnail = styled(ThumbnailUi)`
  opacity: 0;
  transition: opacity 0.3s ease-out;
  fill: var(--icon-on-dark);
  &:hover {
    opacity: 1;
  }
`
