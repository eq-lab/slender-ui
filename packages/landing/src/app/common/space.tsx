import styled from 'styled-components'

const Space = styled.div<{
  height?: number
  heightMobile?: number
  width?: number
  widthMobile?: number
  xl?: boolean
  md?: boolean
  sm?: boolean
  xs?: boolean
}>(
  ({ height, heightMobile, width, widthMobile, xl, md, sm, xs }) => `
    ${height !== undefined ? `height: ${height}px;` : ''}
    ${width !== undefined ? `width: ${width}px;` : ''}
    ${xl ? 'height: 164px' : ''};
    ${md ? 'height: 124px' : ''};
    ${sm ? 'height: 64px' : ''};
    ${xs ? 'height: 48px' : ''};

    @media (max-width: 1023px) {
      height: ${heightMobile !== undefined ? heightMobile : 40}px;
      ${sm || xs ? 'height: 24px' : ''};
      width: ${widthMobile !== undefined ? widthMobile : 0}px;
    }
  `,
)

export default Space
