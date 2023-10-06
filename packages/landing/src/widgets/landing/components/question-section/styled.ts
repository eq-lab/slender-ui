'use client'

import { styled } from 'styled-components'
import { Title } from '../styled'

export const Wrapper = styled.div`
  position: relative;
  margin: 0 24px;

  ${Title} {
    margin: 16px 0 80px;
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
      margin: 0;
    }
  }

  @media (min-width: 1024px) {
    text-align: left;
    display: grid;
    grid-template-columns: 500px 1fr;
    gap: 64px;
    margin: 0 88px;
  }
`
