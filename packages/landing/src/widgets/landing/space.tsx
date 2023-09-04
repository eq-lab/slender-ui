'use client'

import styled from 'styled-components'

export const Space = styled.div<{
  $height?: number
  $heightMobile?: number
}>(
  ({ $height, $heightMobile }) => `
    ${$height !== undefined ? `height: ${$height}px;` : ''}

    @media (max-width: 1023px) {
      ${$heightMobile !== undefined ? `height: ${$heightMobile}px;` : ''}
    }
  `,
)
