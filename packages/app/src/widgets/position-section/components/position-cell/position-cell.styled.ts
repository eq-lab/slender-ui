import styled from 'styled-components'

export const ThumbnailWrapper = styled.div<{ backgroundColor: string }>`
  background: ${({ backgroundColor }) => backgroundColor};
`
