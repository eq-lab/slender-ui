'use client'

import styled from 'styled-components'

export const Space = styled.div.withConfig({
  shouldForwardProp: (propName) => propName === 'children',
})<{
  height?: number
  heightMobile?: number
}>(
  ({ height, heightMobile }) => `
    ${height !== undefined ? `height: ${height}px;` : ''}

    @media (max-width: 1023px) {
      height: ${heightMobile !== undefined ? heightMobile : 40}px;
    }
  `,
)
