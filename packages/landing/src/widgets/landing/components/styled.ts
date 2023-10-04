'use client'

import { styled } from 'styled-components'

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
export const Title = styled.div`
  color: #faf8f7;
  font-size: 48px;
  font-variation-settings: 'wght' 500;
  line-height: 64px;
  > div {
    color: rgba(242, 237, 235, 0.48);
  }
  @media (min-width: 1024px) {
    font-size: 64px;
    line-height: 72px;
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
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  > * {
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
