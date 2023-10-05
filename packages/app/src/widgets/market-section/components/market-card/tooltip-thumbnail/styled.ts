import styled from 'styled-components'
import { ReactComponent as InfoIconRaw } from './info.svg'

export const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-out;
  &:hover {
    opacity: 1;
    svg {
      fill: var(--icon-on-dark);
    }
  }
`

export const InfoIcon = styled(InfoIconRaw)`
  fill: var(--icon-tertiary, rgba(140, 129, 126, 0.48));
  &:hover {
    fill: var(--icon-secondary, rgba(66, 61, 60, 0.64));
  }
`
