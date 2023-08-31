'use client'

import { styled } from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  .nobr {
    white-space: nowrap;
  }
`

export const Container = styled.div`
  padding: 0 24px;
  max-width: calc(1440px + 48px);
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  @media (min-width: 1024px) {
    padding: 0 80px;
  }

  @media (min-width: 1920px) {
    padding: 0 24px;
  }
`

export const Header = styled.header`
  position: fixed;
  top: 20px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  padding: 0 16px;
  z-index: 99;
  ${Container} {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(204, 187, 184, 0.16);
    padding: 4px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media (min-width: 1024px) {
    padding: 0 64px;
  }
`

export const LogoLink = styled.a`
  padding: 0 16px;
  display: flex;
  align-items: center;
  img {
    height: 24px;
    object-fit: contain;
  }
`

export const Button = styled.button`
  background: #faf8f7;
  border-radius: 16px;
  height: 64px;
  padding: 20px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  font-variation-settings: 'wght' 700;
  color: #000;
  letter-spacing: 0.48px;
  &.md {
    height: 48px;
    padding: 12px 24px;
    border-radius: 8px;
  }
`

export const HeaderButton = styled(Button)`
  box-shadow:
    0 4px 8px 0 rgba(51, 20, 0, 0.08),
    0 2px 1px 0 rgba(51, 20, 0, 0.04);
  background: rgba(204, 187, 184, 0.16);
  color: #faf8f7;
  &:hover {
    background: rgba(178, 162, 162, 0.32);
  }
`

export const Title = styled.div`
  color: #faf8f7;
  font-size: 48px;
  font-variation-settings: 'wght' 500;
  line-height: 64px;
  & > div {
    color: rgba(242, 237, 235, 0.48);
  }
  @media (min-width: 1024px) {
    font-size: 64px;
    line-height: 72px;
  }
`

export const Pluses = styled.div`
  position: absolute;
  height: 360px;
  object-fit: cover;
  left: 50%;
  top: 0;
  transform: translateX(-44%);
  width: 867px;

  @media (min-width: 765px) {
    transform: translateX(0);
    left: auto;
    right: -220px;
  }

  @media (min-width: 1024px) {
    height: 438px;
    right: 0;
  }
`

export const ProtocolRow = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 10px;
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`
export const Protocol = styled.div`
  color: #faf8f7;
  font-size: 32px;
  font-variation-settings: 'wght' 500;
  line-height: 40px;
  max-width: 330px;

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

  @media (min-width: 1024px) {
    max-width: 100%;
  }
`

export const Fund = styled.div`
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  span {
    color: rgb(242, 237, 235);
    opacity: 0.48;
  }
`

export const RatesBox = styled.div`
  background: #252222;
  border-radius: 48px;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 436px 1fr;
    gap: 64px;
    padding: 48px;
  }
`

export const RatesPack = styled.div`
  position: relative;
  height: 424px;
  width: 100%;

  @media (min-width: 1024px) {
    margin: auto;
    width: 436px;
    height: 630px;
  }
`

export const RatesAside = styled.div`
  @media (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`

export const RatesInfoUnit = styled.div`
  padding-top: 22px;
  padding-bottom: 42px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  & + & {
    border-top: 1px solid #faf8f7;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (min-width: 1024px) {
    flex-direction: column;
  }

  @media (min-width: 1440px) {
    flex-direction: row;
  }

  @media (min-width: 1920px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`
export const RatesTitle = styled.div`
  color: #faf8f7;
  font-size: 32px;
  font-variation-settings: 'wght' 600;
  line-height: 40px;
  letter-spacing: 0.64px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    &.liquidations {
      white-space: nowrap;
    }
  }
  @media (min-width: 1024px) {
    &.liquidations {
      white-space: normal;
    }
  }
`
export const RatesDescription = styled.div`
  color: #faf8f7;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.16px;

  @media (min-width: 768px) {
    max-width: 320px;
  }

  @media (min-width: 1920px) {
    max-width: 100%;
  }
`

export const SugarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
  @media (min-width: 1024px) {
    margin-top: 0;
    align-items: flex-start;
  }

  @media (min-width: 1440px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

export const SugarInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

export const Launch = styled.div`
  position: relative;
  overflow: hidden;

  ${Container} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    & > * {
      width: 100%;
      position: relative;
      z-index: 2;
    }
  }

  @media (min-width: 1024px) {
    .title {
      max-width: 695px;
    }
  }
`

export const InputLabel = styled.div`
  color: rgba(242, 237, 235, 0.48);
  letter-spacing: 0.16px;
  left: 16px;
  top: 50%;
  transition: 200ms ease-out;
  position: absolute;
  transform: translateY(-50%);
`

export const InputBox = styled.div`
  background-color: rgba(204, 187, 184, 0.16);
  padding: 20px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-variation-settings: 'wght' 500;
  letter-spacing: 0.16px;
  position: relative;
  transition: 200ms ease-out;
  text-align: left;
  height: 64px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  .input {
    background: transparent;
    border: 0;
    transition: 200ms ease-out;
    color: #faf8f7;
    caret-color: #faf8f7;
    line-height: 1;
    transform: translateY(6px);
    width: 100%;
    padding-top: 6px;
    padding-bottom: 4px;
  }

  &.focused {
    ${InputLabel} {
      top: 10px;
      font-size: 12px;
      letter-spacing: 0.5px;
      transform: translateY(0%);
    }
  }

  &.error {
    background: rgba(107, 64, 84, 0.72);
    ${InputLabel} {
      color: #e54796;
    }
    input {
      color: #e54796;
    }
  }
`

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  & > * {
    width: 100%;
  }
  .email {
    width: 64px;
    height: 64px;
    object-fit: contain;
    object-position: center;
    margin: 0 auto;
  }
  @media (min-width: 1024px) {
    max-width: 675px;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
    align-items: center;
    ${Button} {
      max-width: 180px;
    }
  }
`

export const LaunchBg = styled.div`
  position: absolute;
  height: 630px;
  width: 604px;
  object-fit: contain;
  object-position: center;
  right: 60px;
  bottom: -60px;

  @media (min-width: 768px) {
    right: auto;
    left: -110px;
    bottom: -50px;
    height: 600px;
  }

  @media (min-width: 1024px) {
    height: 976px;
    bottom: -460px;
    left: -80px;
    height: 976px;
    width: 936px;
  }

  @media (min-width: 1440px) {
    height: 976px;
    bottom: -460px;
    left: 0;
  }
`
