import { styled } from 'styled-components';
import { Button } from '../styled';

const MOBILE_SIZE = '864px';

export const DesktopWrapper = styled.div`
  border-radius: var(--rounding-radius-xxxl, 48px);
  overflow: hidden;
  // a hack for removing dark shadows in corners with border-radius
  backdrop-filter: blur(0);

  display: none;

  @media (min-width: ${MOBILE_SIZE}) {
    display: block;
  }
`;

export const ScreenApp = styled.div`
  position: relative;
  aspect-ratio: 864/486;
  background: #fff;

  @media (min-width: ${MOBILE_SIZE}) {
    &.hovered:before {
      content: '';
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--background-overlay, rgba(20, 16, 15, 0.8));
      backdrop-filter: blur(12px);
    }
  }
`;

export const ProtocolRow = styled.div`
  display: none;

  @media (min-width: ${MOBILE_SIZE}) {
    display: flex;
    color: var(--text-primary, #faf8f7);
    z-index: 2;

    > * {
      opacity: 0;
    }

    &.hovered {
      > * {
        opacity: 1;
      }
    }

    position: absolute;
    top: 25%;
    width: 100%;
    height: 50%;
    flex-direction: column;
    align-items: center;
    padding-top: 52px;
  }
`;

export const MobileWrapper = styled.div`
  @media (min-width: ${MOBILE_SIZE}) {
    display: none;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  margin-right: -24px;
  aspect-ratio: 1280/1088;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow: hidden;
`;

export const Protocol = styled.div`
  font-size: 32px;
  font-variation-settings: 'wght' 500;
  line-height: 40px;
  max-width: 330px;

  &.mobile {
    margin-top: 64px;
  }

  img,
  svg {
    display: inline-block;
    height: 32px;
    object-fit: contain;
    vertical-align: bottom;
    width: 128px;
    margin-left: 6px;
    transform: translateY(-2px);
  }

  @media (min-width: ${MOBILE_SIZE}) {
    max-width: 100%;
  }
`;
export const Fund = styled.div`
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.16px;
  display: flex;
  gap: 8px;
  margin-top: 34px;
  span {
    color: var(--text-secondary, rgba(242, 237, 235, 0.48));
  }
`;
export const AppButton = styled(Button)`
  margin-top: 48px;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  gap: 8px;

  &:hover {
    background-color: var(--fill-elevated-hover, #faf8f7);
  }
`;
