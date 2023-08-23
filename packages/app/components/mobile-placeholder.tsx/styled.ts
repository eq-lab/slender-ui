import { styled } from 'styled-components'

export const LayoutSwitcher = styled.div`
  .desktop {
    display: none;
  }
  .mobile {
    display: block;
  }
  @media (min-width: 1024px) {
    .desktop {
      display: block;
    }
    .mobile {
      display: none;
    }
  }
`

export const Wrapper = styled.div`
  background: #000;
  color: #fff;
  text-align: center;
  font-size: 32px;
  line-height: 40px;
  position: relative;
  overflow: hidden;
  font-family: 'PlusJakartaSans', sans-serif;
  font-weight: 700;
  .bg {
    height: 744px;
    width: auto;
    object-fit: contain;
    object-position: center;
    position: absolute;
    top: -304px;
    left: -170px;
    @media (min-width: 768px) {
      left: auto;
      right: -386px;
    }
  }

  .picture {
    width: fit-content;
    overflow: hidden;
    margin: 0 auto 26px;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
      max-height: 320px;
      border-radius: 8px;
    }

    .md {
      display: none;
    }
    @media (min-width: 768px) {
      margin-bottom: 76px;
      .sm {
        display: none;
      }
      .md {
        display: block;
      }
    }
  }
`

export const Logo = styled.img`
  display: block;
`

export const Container = styled.div`
  position: relative;
  z-index: 2;
  margin: 0 auto;
  max-width: calc(720px + 48px);
  width: 100%;
  padding: 192px 24px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  min-height: 100dvh;

  @media (min-width: 768px) {
    padding-top: 282px;
  }
`
