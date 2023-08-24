'use client'

import React from 'react'
import { Container, Logo, Wrapper } from './styled'

export function MobilePlaceholder() {
  return (
    <Wrapper>
      <img src="/img/bg.png" alt="" className="bg" />
      <Container>
        <Logo src="/img/logo.svg" alt="" />

        <div>
          <div className="picture">
            <img src="/img/mobile-placeholder-sm.jpg" alt="" className="sm" />
            <img src="/img/mobile-placeholder-md.jpg" alt="" className="md" />
          </div>
          <div>Waiting for you on the desktop version</div>
        </div>
      </Container>
    </Wrapper>
  )
}
