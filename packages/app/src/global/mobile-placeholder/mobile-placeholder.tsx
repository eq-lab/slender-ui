'use client'

import React from 'react'
import Image from 'next/image'
import { Container, Logo, Wrapper } from './styled'
import backgroundImage from './images/bg.png'
import smPlaceholderImage from './images/mobile-placeholder-sm.jpg'
import mdPlaceholderImage from './images/mobile-placeholder-md.jpg'

export function MobilePlaceholder() {
  return (
    <Wrapper>
      <Image
        src={backgroundImage}
        alt=""
        className="bg"
        style={{
          objectFit: 'contain',
        }}
        sizes="100vw"
      />
      <Container>
        <Logo />

        <div>
          <div className="picture">
            <Image
              src={smPlaceholderImage}
              alt=""
              className="sm"
              style={{
                objectFit: 'contain',
              }}
              sizes="100vw"
            />
            <Image
              src={mdPlaceholderImage}
              alt=""
              className="md"
              style={{
                objectFit: 'contain',
              }}
              sizes="100vw"
            />
          </div>
          <div>Waiting for you on the desktop version</div>
        </div>
      </Container>
    </Wrapper>
  )
}
